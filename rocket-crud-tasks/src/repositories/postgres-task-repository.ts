import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import type { Task, TaskFilters, CreateTaskInput, UpdateTaskInput, TaskRepository } from '../types.js';

export class PostgresTaskRepository implements TaskRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async create({ title, description }: CreateTaskInput): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await this.pool.query(
      `
        INSERT INTO tasks (id, title, description, completed_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [task.id, task.title, task.description, task.completed_at, task.created_at, task.updated_at],
    );

    return task;
  }

  async findAll({ title, description }: TaskFilters = {}): Promise<Task[]> {
    const filters: string[] = [];
    const values: unknown[] = [];

    if (title) {
      values.push(`%${title}%`);
      filters.push(`title ILIKE $${values.length}`);
    }

    if (description) {
      values.push(`%${description}%`);
      filters.push(`description ILIKE $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const result = await this.pool.query<Task>(
      `SELECT * FROM tasks ${whereClause} ORDER BY created_at ASC`,
      values,
    );

    return result.rows;
  }

  async findById(id: string): Promise<Task | null> {
    const result = await this.pool.query<Task>(
      'SELECT * FROM tasks WHERE id = $1 LIMIT 1',
      [id],
    );
    return result.rows[0] ?? null;
  }

  async update(id: string, payload: UpdateTaskInput): Promise<Task | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (payload.title !== undefined) {
      values.push(payload.title);
      fields.push(`title = $${values.length}`);
    }

    if (payload.description !== undefined) {
      values.push(payload.description);
      fields.push(`description = $${values.length}`);
    }

    values.push(new Date());
    fields.push(`updated_at = $${values.length}`);

    values.push(id);

    const result = await this.pool.query<Task>(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values,
    );

    return result.rows[0] ?? null;
  }

  async remove(id: string): Promise<void> {
    await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  async toggleCompletion(id: string, completedAt: Date | null): Promise<Task | null> {
    const result = await this.pool.query<Task>(
      `
        UPDATE tasks
        SET completed_at = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
      `,
      [completedAt, new Date(), id],
    );

    return result.rows[0] ?? null;
  }
}
