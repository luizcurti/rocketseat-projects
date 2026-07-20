import { jest } from '@jest/globals';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { Pool } from 'pg';
import {
  ensureMigrationsTable,
  runUpMigrations,
  runDownMigrations,
  createMigrationFiles,
} from '../../src/database/migrations-manager.js';

const makePool = (): { pool: Pool; query: jest.Mock } => {
  const query = jest.fn();
  return { pool: { query } as unknown as Pool, query };
};

describe('migrations-manager', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'migrations-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe('ensureMigrationsTable', () => {
    it('runs the CREATE TABLE query', async () => {
      const { pool, query } = makePool();
      query.mockResolvedValueOnce({});

      await ensureMigrationsTable(pool);

      expect(query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations'));
    });
  });

  describe('runUpMigrations', () => {
    it('runs a new migration file', async () => {
      await fs.writeFile(path.join(tmpDir, '001_init.up.sql'), 'CREATE TABLE t1 (id INT);');

      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})                  // ensureMigrationsTable
        .mockResolvedValueOnce({ rowCount: 0 })     // SELECT (not applied)
        .mockResolvedValueOnce({})                  // BEGIN
        .mockResolvedValueOnce({})                  // run SQL
        .mockResolvedValueOnce({})                  // INSERT version
        .mockResolvedValueOnce({});                 // COMMIT

      await runUpMigrations(pool, tmpDir);

      const calls = query.mock.calls.map((c) => c[0] as string);
      expect(calls.some((s) => s.includes('BEGIN'))).toBe(true);
      expect(calls.some((s) => s.includes('COMMIT'))).toBe(true);
      expect(calls.some((s) => s.includes('INSERT INTO schema_migrations'))).toBe(true);
    });

    it('skips already applied migrations', async () => {
      await fs.writeFile(path.join(tmpDir, '001_init.up.sql'), 'SELECT 1;');

      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})              // ensureMigrationsTable
        .mockResolvedValueOnce({ rowCount: 1 }); // SELECT (already applied)

      await runUpMigrations(pool, tmpDir);

      const calls = query.mock.calls.map((c) => c[0] as string);
      expect(calls.some((s) => s.includes('BEGIN'))).toBe(false);
    });

    it('rolls back and re-throws on migration SQL error', async () => {
      await fs.writeFile(path.join(tmpDir, '001_fail.up.sql'), 'INVALID SQL;');

      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})               // ensureMigrationsTable
        .mockResolvedValueOnce({ rowCount: 0 })  // SELECT (not applied)
        .mockResolvedValueOnce({})               // BEGIN
        .mockRejectedValueOnce(new Error('syntax error'))  // run SQL fails
        .mockResolvedValueOnce({});              // ROLLBACK

      await expect(runUpMigrations(pool, tmpDir)).rejects.toThrow('syntax error');

      const calls = query.mock.calls.map((c) => c[0] as string);
      expect(calls.some((s) => s.includes('ROLLBACK'))).toBe(true);
    });

    it('works with no migration files', async () => {
      const { pool, query } = makePool();
      query.mockResolvedValueOnce({}); // ensureMigrationsTable only

      await runUpMigrations(pool, tmpDir);
      expect(query).toHaveBeenCalledTimes(1);
    });

    it('uses the default migrations directory when none is provided', async () => {
      const { pool, query } = makePool();
      // Pretend the single migration in the real dir is already applied
      query
        .mockResolvedValueOnce({})              // ensureMigrationsTable
        .mockResolvedValue({ rowCount: 1 });    // all SELECT checks → already applied

      await runUpMigrations(pool); // no directory argument → uses default
      expect(query).toHaveBeenCalled();
    });
  });

  describe('runDownMigrations', () => {
    it('runs the down migration for the last applied version', async () => {
      await fs.writeFile(path.join(tmpDir, '001_init.down.sql'), 'DROP TABLE t1;');

      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})  // ensureMigrationsTable
        .mockResolvedValueOnce({ rows: [{ version: '001_init.up.sql' }] })  // SELECT applied
        .mockResolvedValueOnce({})  // BEGIN
        .mockResolvedValueOnce({})  // run down SQL
        .mockResolvedValueOnce({})  // DELETE version
        .mockResolvedValueOnce({}); // COMMIT

      await runDownMigrations(pool, 1, tmpDir);

      const calls = query.mock.calls.map((c) => c[0] as string);
      expect(calls.some((s) => s.includes('COMMIT'))).toBe(true);
      expect(calls.some((s) => s.includes('DELETE FROM schema_migrations'))).toBe(true);
    });

    it('rolls back and re-throws on down migration error', async () => {
      await fs.writeFile(path.join(tmpDir, '001_fail.down.sql'), 'INVALID;');

      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})  // ensureMigrationsTable
        .mockResolvedValueOnce({ rows: [{ version: '001_fail.up.sql' }] })  // SELECT applied
        .mockResolvedValueOnce({})  // BEGIN
        .mockRejectedValueOnce(new Error('down error'))  // run down SQL fails
        .mockResolvedValueOnce({}); // ROLLBACK

      await expect(runDownMigrations(pool, 1, tmpDir)).rejects.toThrow('down error');

      const calls = query.mock.calls.map((c) => c[0] as string);
      expect(calls.some((s) => s.includes('ROLLBACK'))).toBe(true);
    });

    it('does nothing when no migrations are applied', async () => {
      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})           // ensureMigrationsTable
        .mockResolvedValueOnce({ rows: [] }); // SELECT applied (none)

      await runDownMigrations(pool, 1, tmpDir);
      expect(query).toHaveBeenCalledTimes(2);
    });

    it('uses default steps=1 when steps is not provided', async () => {
      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})           // ensureMigrationsTable
        .mockResolvedValueOnce({ rows: [] }); // SELECT applied (none)

      await runDownMigrations(pool, undefined, tmpDir);
      expect(query).toHaveBeenCalledTimes(2);
    });

    it('uses default directory when none is provided and no migrations applied', async () => {
      const { pool, query } = makePool();
      query
        .mockResolvedValueOnce({})           // ensureMigrationsTable
        .mockResolvedValueOnce({ rows: [] }); // SELECT applied (none) → no files read

      await runDownMigrations(pool); // no directory → uses default
      expect(query).toHaveBeenCalledTimes(2);
    });
  });

  describe('createMigrationFiles', () => {
    it('creates timestamped up and down SQL files', async () => {
      const { upFile, downFile } = await createMigrationFiles('add_users', tmpDir);

      expect(upFile).toMatch(/^\d+_add_users\.up\.sql$/);
      expect(downFile).toMatch(/^\d+_add_users\.down\.sql$/);

      const upContent = await fs.readFile(path.join(tmpDir, upFile), 'utf8');
      expect(upContent).toContain('UP migration');
    });

    it('normalizes migration name with special characters', async () => {
      const { upFile } = await createMigrationFiles('  My Migration!!  ', tmpDir);
      expect(upFile).toContain('my_migration');
    });

    it('uses new_migration when name normalizes to empty', async () => {
      const { upFile } = await createMigrationFiles('', tmpDir);
      expect(upFile).toContain('new_migration');
    });

    it('uses new_migration when name contains only special characters', async () => {
      const { upFile } = await createMigrationFiles('!!!!', tmpDir);
      expect(upFile).toContain('new_migration');
    });
  });
});
