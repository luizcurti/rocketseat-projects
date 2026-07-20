import { NotFoundError, ValidationError } from '../utils/errors.js';
import type { TaskRepository, CreateTaskInput, UpdateTaskInput, TaskFilters, Task } from '../types.js';

function assertPlainObject(payload: unknown): asserts payload is Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new ValidationError('Request body must be a JSON object.');
  }
}

function assertAllowedFields(payload: Record<string, unknown>, allowedFields: string[]): void {
  const keys = Object.keys(payload);

  for (const key of keys) {
    if (!allowedFields.includes(key)) {
      throw new ValidationError(`Unexpected field: "${key}".`);
    }
  }
}

function validateTaskPayload(
  { title, description }: Record<string, unknown>,
  { partial = false } = {},
): void {
  if (!partial || title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new ValidationError('The field "title" is required and must be a non-empty string.');
    }
  }

  if (!partial || description !== undefined) {
    if (typeof description !== 'string' || description.trim().length === 0) {
      throw new ValidationError(
        'The field "description" is required and must be a non-empty string.',
      );
    }
  }
}

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async create(input: unknown): Promise<Task> {
    assertPlainObject(input);
    assertAllowedFields(input, ['title', 'description']);
    validateTaskPayload(input);
    return this.taskRepository.create(input as unknown as CreateTaskInput);
  }

  async list(filters: TaskFilters): Promise<Task[]> {
    return this.taskRepository.findAll(filters);
  }

  async update(id: string, payload: unknown): Promise<Task> {
    assertPlainObject(payload);
    assertAllowedFields(payload, ['title', 'description']);

    if (payload.title === undefined && payload.description === undefined) {
      throw new ValidationError('At least one field must be provided: "title" or "description".');
    }

    validateTaskPayload(payload, { partial: true });

    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError('Task not found.');
    }

    const result = await this.taskRepository.update(id, payload as UpdateTaskInput);
    return result as Task;
  }

  async remove(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError('Task not found.');
    }

    await this.taskRepository.remove(id);
  }

  async toggleCompletion(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError('Task not found.');
    }

    const nextCompletedAt = task.completed_at ? null : new Date();
    const result = await this.taskRepository.toggleCompletion(id, nextCompletedAt);
    return result as Task;
  }
}
