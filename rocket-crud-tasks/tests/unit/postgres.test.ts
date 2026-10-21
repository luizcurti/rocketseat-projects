import { jest } from '@jest/globals';
import type { Pool } from 'pg';
import { createPostgresClient, runMigrations } from '../../src/database/postgres.js';

describe('postgres', () => {
  describe('createPostgresClient', () => {
    it('returns a pool with a query method', () => {
      const pool = createPostgresClient('postgresql://fake:fake@localhost:9999/fake');

      expect(typeof pool.query).toBe('function');
      expect(typeof pool.end).toBe('function');

      // Terminate without connecting to avoid dangling handles
      pool.end().catch(() => {});
    });
  });

  describe('runMigrations', () => {
    it('delegates to runUpMigrations using the provided pool', async () => {
      const query = jest.fn().mockResolvedValue({ rowCount: 1 });
      const pool = { query } as unknown as Pool;

      // All migrations reported as already applied → no SQL runs, just succeeds
      await runMigrations(pool);

      expect(query).toHaveBeenCalled();
    });
  });
});
