import { InMemoryTaskRepository } from '../../src/repositories/in-memory-task-repository.js';

describe('InMemoryTaskRepository', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
  });

  it('creates and finds tasks', async () => {
    const task = await repository.create({ title: 'A', description: 'B' });

    const found = await repository.findById(task.id);
    expect(found).toBeTruthy();
    expect(found!.title).toBe('A');
  });

  it('filters tasks by title and description', async () => {
    await repository.create({ title: 'Shopping', description: 'Buy milk' });
    await repository.create({ title: 'Work', description: 'Send report' });

    const byTitle = await repository.findAll({ title: 'shop' });
    const byDescription = await repository.findAll({ description: 'report' });

    expect(byTitle).toHaveLength(1);
    expect(byDescription).toHaveLength(1);
  });

  it('updates and toggles completion', async () => {
    const task = await repository.create({ title: 'A', description: 'B' });

    const updated = await repository.update(task.id, { title: 'X' });
    expect(updated!.title).toBe('X');

    const completed = await repository.toggleCompletion(task.id, new Date());
    expect(completed!.completed_at).toBeInstanceOf(Date);
  });

  it('returns null when updating unknown task', async () => {
    const result = await repository.update('missing', { title: 'X' });
    expect(result).toBeNull();
  });

  it('returns null when toggling unknown task', async () => {
    const result = await repository.toggleCompletion('missing', new Date());
    expect(result).toBeNull();
  });

  it('removes tasks and clears storage', async () => {
    const task = await repository.create({ title: 'A', description: 'B' });

    await repository.remove(task.id);
    expect(await repository.findById(task.id)).toBeNull();

    await repository.create({ title: 'C', description: 'D' });
    repository.clear();
    expect(await repository.findAll()).toHaveLength(0);
  });
});
