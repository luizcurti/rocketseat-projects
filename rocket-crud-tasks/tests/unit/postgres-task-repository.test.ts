import { jest } from '@jest/globals';
import type { Pool } from 'pg';
import { PostgresTaskRepository } from '../../src/repositories/postgres-task-repository.js';

const makePool = (): { pool: Pool; query: jest.Mock } => {
  const query = jest.fn();
  return { pool: { query } as unknown as Pool, query };
};

describe('PostgresTaskRepository', () => {
  it('creates a task and returns it', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({});

    const repo = new PostgresTaskRepository(pool);
    const task = await repo.create({ title: 'A', description: 'B' });

    expect(task.title).toBe('A');
    expect(task.description).toBe('B');
    expect(task.completed_at).toBeNull();
    expect(task.id).toBeTruthy();
    expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT'), expect.any(Array));
  });

  it('findAll returns all rows without filters', async () => {
    const { pool, query } = makePool();
    const rows = [{ id: '1', title: 'A', description: 'B', completed_at: null }];
    query.mockResolvedValueOnce({ rows });

    const repo = new PostgresTaskRepository(pool);
    const result = await repo.findAll();

    expect(result).toEqual(rows);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), []);
  });

  it('findAll applies title filter', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({ rows: [] });

    const repo = new PostgresTaskRepository(pool);
    await repo.findAll({ title: 'test' });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('ILIKE'),
      expect.arrayContaining(['%test%']),
    );
  });

  it('findAll applies description filter', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({ rows: [] });

    const repo = new PostgresTaskRepository(pool);
    await repo.findAll({ description: 'desc' });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('ILIKE'),
      expect.arrayContaining(['%desc%']),
    );
  });

  it('findAll applies both filters simultaneously', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({ rows: [] });

    const repo = new PostgresTaskRepository(pool);
    await repo.findAll({ title: 'a', description: 'b' });

    const values = query.mock.calls[0][1] as unknown[];
    expect(values).toHaveLength(2);
  });

  it('findById returns the matching row', async () => {
    const { pool, query } = makePool();
    const row = { id: '123', title: 'A', description: 'B' };
    query.mockResolvedValueOnce({ rows: [row] });

    const repo = new PostgresTaskRepository(pool);
    const found = await repo.findById('123');

    expect(found).toEqual(row);
  });

  it('findById returns null when not found', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({ rows: [] });

    const repo = new PostgresTaskRepository(pool);
    expect(await repo.findById('missing')).toBeNull();
  });

  it('update returns the updated row', async () => {
    const { pool, query } = makePool();
    const updated = { id: '1', title: 'New', description: 'B' };
    query.mockResolvedValueOnce({ rows: [updated] });

    const repo = new PostgresTaskRepository(pool);
    const result = await repo.update('1', { title: 'New' });

    expect(result).toEqual(updated);
  });

  it('update with description-only builds correct SQL', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({ rows: [{ id: '1' }] });

    const repo = new PostgresTaskRepository(pool);
    await repo.update('1', { description: 'New desc' });

    const sql = query.mock.calls[0][0] as string;
    expect(sql).toContain('description');
    expect(sql).not.toContain('title');
  });

  it('update returns null when target not found', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({ rows: [] });

    const repo = new PostgresTaskRepository(pool);
    expect(await repo.update('missing', { title: 'X' })).toBeNull();
  });

  it('remove calls DELETE query', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({});

    const repo = new PostgresTaskRepository(pool);
    await repo.remove('1');

    expect(query).toHaveBeenCalledWith(expect.stringContaining('DELETE'), ['1']);
  });

  it('toggleCompletion returns updated row', async () => {
    const { pool, query } = makePool();
    const now = new Date();
    const row = { id: '1', completed_at: now };
    query.mockResolvedValueOnce({ rows: [row] });

    const repo = new PostgresTaskRepository(pool);
    const result = await repo.toggleCompletion('1', now);

    expect(result).toEqual(row);
  });

  it('toggleCompletion returns null when not found', async () => {
    const { pool, query } = makePool();
    query.mockResolvedValueOnce({ rows: [] });

    const repo = new PostgresTaskRepository(pool);
    expect(await repo.toggleCompletion('missing', null)).toBeNull();
  });
});
