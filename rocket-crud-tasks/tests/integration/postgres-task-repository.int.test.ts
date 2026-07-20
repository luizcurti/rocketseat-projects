import { jest } from '@jest/globals';
import type { Pool } from 'pg';
import { PostgresTaskRepository } from '../../src/repositories/postgres-task-repository.js';

describe('PostgresTaskRepository integration', () => {
  let repository: PostgresTaskRepository;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    mockQuery = jest.fn();
    const pool = { query: mockQuery } as unknown as Pool;
    repository = new PostgresTaskRepository(pool);
  });

  it('performs CRUD and completion toggle', async () => {
    // create
    mockQuery.mockResolvedValueOnce({});
    const created = await repository.create({ title: 'A', description: 'B' });
    expect(created.title).toBe('A');

    // findAll
    mockQuery.mockResolvedValueOnce({ rows: [created] });
    const listed = await repository.findAll({ title: 'A' });
    expect(listed).toHaveLength(1);

    // update
    const updated = { ...created, description: 'B2' };
    mockQuery.mockResolvedValueOnce({ rows: [updated] });
    const updateResult = await repository.update(created.id, { description: 'B2' });
    expect(updateResult!.description).toBe('B2');

    // toggleCompletion
    const now = new Date();
    const completed = { ...created, completed_at: now };
    mockQuery.mockResolvedValueOnce({ rows: [completed] });
    const toggleResult = await repository.toggleCompletion(created.id, now);
    expect(toggleResult!.completed_at).toBeTruthy();

    // remove
    mockQuery.mockResolvedValueOnce({});
    await repository.remove(created.id);

    // findById — not found
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });
});
