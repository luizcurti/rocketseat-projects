import { Pool } from 'pg';
import { runUpMigrations } from './migrations-manager.js';

export const createPostgresClient = (connectionString: string): Pool => {
  return new Pool({ connectionString });
};

export const runMigrations = async (pool: Pool): Promise<void> => {
  await runUpMigrations(pool);
};
