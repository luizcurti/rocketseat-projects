import { TaskService } from '../../src/services/task-service.js';
import { InMemoryTaskRepository } from '../../src/repositories/in-memory-task-repository.js';
import { NotFoundError, ValidationError } from '../../src/utils/errors.js';

describe('TaskService', () => {
  let repository: InMemoryTaskRepository;
  let taskService: TaskService;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    taskService = new TaskService(repository);
  });

  it('creates a task', async () => {
    const task = await taskService.create({
      title: 'Buy groceries',
      description: 'Milk and eggs',
    });

    expect(task).toHaveProperty('id');
    expect(task.completed_at).toBeNull();
    expect(task.created_at).toBeInstanceOf(Date);
    expect(task.updated_at).toBeInstanceOf(Date);
  });

  it('throws validation error when creating invalid task', async () => {
    await expect(
      taskService.create({
        title: '',
        description: 'desc',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('throws validation error when description is invalid', async () => {
    await expect(
      taskService.create({
        title: 'Valid title',
        description: '   ',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('throws validation error when payload is not an object', async () => {
    await expect(taskService.create('invalid')).rejects.toThrow(ValidationError);
  });

  it('throws validation error for unexpected fields', async () => {
    await expect(
      taskService.create({
        title: 'Valid title',
        description: 'Valid description',
        extra: 'nope',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('lists tasks using filters', async () => {
    await taskService.create({ title: 'Task One', description: 'Alpha' });
    await taskService.create({ title: 'Task Two', description: 'Beta' });

    const tasks = await taskService.list({ title: 'one' });

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Task One');
  });

  it('updates an existing task', async () => {
    const task = await taskService.create({ title: 'A', description: 'B' });

    const updatedTask = await taskService.update(task.id, {
      title: 'Updated title',
    });

    expect(updatedTask.title).toBe('Updated title');
    expect(updatedTask.description).toBe('B');
  });

  it('throws not found when updating unknown task', async () => {
    await expect(
      taskService.update('non-existent-id', { title: 'X' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('removes a task', async () => {
    const task = await taskService.create({ title: 'A', description: 'B' });
    await taskService.remove(task.id);
    const tasks = await taskService.list({});
    expect(tasks).toHaveLength(0);
  });

  it('throws not found when removing unknown task', async () => {
    await expect(taskService.remove('non-existent-id')).rejects.toThrow(NotFoundError);
  });

  it('toggles completion', async () => {
    const task = await taskService.create({ title: 'A', description: 'B' });
    const completed = await taskService.toggleCompletion(task.id);
    expect(completed.completed_at).toBeInstanceOf(Date);

    const uncompleted = await taskService.toggleCompletion(task.id);
    expect(uncompleted.completed_at).toBeNull();
  });

  it('throws not found when toggling unknown task', async () => {
    await expect(taskService.toggleCompletion('non-existent-id')).rejects.toThrow(NotFoundError);
  });
});
