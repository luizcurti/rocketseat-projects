import { env } from '../config/env.js';
import { createPostgresClient } from '../database/postgres.js';
import {
  createMigrationFiles,
  runDownMigrations,
  runUpMigrations,
} from '../database/migrations-manager.js';

const command = process.argv[2];
const arg = process.argv[3];

const run = async (): Promise<void> => {
  if (command === 'create') {
    const files = await createMigrationFiles(arg || 'new_migration');
    console.log(JSON.stringify({ command, ...files }));
    return;
  }

  if (command !== 'up' && command !== 'down') {
    throw new Error('Invalid migration command. Use: create | up | down');
  }

  const pool = createPostgresClient(env.databaseUrl);

  try {
    if (command === 'up') {
      await runUpMigrations(pool);
      console.log(JSON.stringify({ command, status: 'ok' }));
      return;
    }

    const steps = Number(arg || 1);
    await runDownMigrations(pool, steps);
    console.log(JSON.stringify({ command, steps, status: 'ok' }));
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(JSON.stringify({ command, status: 'error', message: (error as Error).message }));
  process.exit(1);
});
