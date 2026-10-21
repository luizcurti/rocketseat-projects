import { env } from './config/env.js';
import { createPostgresClient, runMigrations } from './database/postgres.js';
import { PostgresTaskRepository } from './repositories/postgres-task-repository.js';
import { TaskService } from './services/task-service.js';
import { createApp } from './app.js';

export const bootstrap = async (): Promise<void> => {
  const pool = createPostgresClient(env.databaseUrl);
  await runMigrations(pool);

  const taskRepository = new PostgresTaskRepository(pool);
  const taskService = new TaskService(taskRepository);
  const app = createApp({
    taskService,
    healthCheck: async () => {
      try {
        await pool.query('SELECT 1');
        return { status: 'ok', database: 'up' };
      } catch {
        return { status: 'degraded', database: 'down' };
      }
    },
  });

  app.listen(env.port, () => {
    console.log(JSON.stringify({ message: 'Server started', port: env.port }));
  });
};

if (process.env.RUN_SERVER !== 'false') {
  bootstrap().catch((error) => {
    console.error(
      JSON.stringify({ message: 'Failed to start server', error: (error as Error).message }),
    );
    process.exit(1);
  });
}
