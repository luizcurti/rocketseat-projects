import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultMigrationsDirectory = path.join(__dirname, 'migrations');

const MIGRATIONS_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

const normalizeName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const getUpMigrationFiles = async (migrationsDirectory: string): Promise<string[]> => {
  const entries = await fs.readdir(migrationsDirectory);
  return entries.filter((file) => file.endsWith('.up.sql')).sort();
};

export const ensureMigrationsTable = async (pool: Pool): Promise<void> => {
  await pool.query(MIGRATIONS_TABLE_QUERY);
};

export const runUpMigrations = async (
  pool: Pool,
  migrationsDirectory: string = defaultMigrationsDirectory,
): Promise<void> => {
  await ensureMigrationsTable(pool);

  const migrationFiles = await getUpMigrationFiles(migrationsDirectory);

  for (const file of migrationFiles) {
    const result = await pool.query(
      'SELECT 1 FROM schema_migrations WHERE version = $1 LIMIT 1',
      [file],
    );

    /* istanbul ignore next */
    const alreadyApplied = (result.rowCount ?? 0) > 0;
    if (alreadyApplied) {
      continue;
    }

    const migrationPath = path.join(migrationsDirectory, file);
    const sql = await fs.readFile(migrationPath, 'utf8');

    await pool.query('BEGIN');

    try {
      await pool.query(sql);
      await pool.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }
};

export const runDownMigrations = async (
  pool: Pool,
  steps = 1,
  migrationsDirectory: string = defaultMigrationsDirectory,
): Promise<void> => {
  await ensureMigrationsTable(pool);

  const applied = await pool.query(
    'SELECT version FROM schema_migrations ORDER BY executed_at DESC LIMIT $1',
    [steps],
  );

  for (const row of applied.rows as Array<{ version: string }>) {
    const upFile = row.version;
    const downFile = upFile.replace(/\.up\.sql$/, '.down.sql');
    const downPath = path.join(migrationsDirectory, downFile);

    const sql = await fs.readFile(downPath, 'utf8');

    await pool.query('BEGIN');

    try {
      await pool.query(sql);
      await pool.query('DELETE FROM schema_migrations WHERE version = $1', [upFile]);
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }
};

export const createMigrationFiles = async (
  name: string,
  /* istanbul ignore next */
  migrationsDirectory: string = defaultMigrationsDirectory,
): Promise<{ upFile: string; downFile: string }> => {
  const normalized = normalizeName(name || 'new_migration') || 'new_migration';
  const versionPrefix = `${Date.now()}`;
  const baseName = `${versionPrefix}_${normalized}`;
  const upFile = `${baseName}.up.sql`;
  const downFile = `${baseName}.down.sql`;

  await fs.mkdir(migrationsDirectory, { recursive: true });

  await fs.writeFile(
    path.join(migrationsDirectory, upFile),
    '-- Write your UP migration SQL here.\n',
  );
  await fs.writeFile(
    path.join(migrationsDirectory, downFile),
    '-- Write your DOWN migration SQL here.\n',
  );

  return { upFile, downFile };
};
