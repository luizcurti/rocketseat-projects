import { randomUUID } from 'node:crypto';
import type { Task, TaskFilters, CreateTaskInput, UpdateTaskInput, TaskRepository } from '../types.js';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[];

  constructor(initialTasks: Task[] = []) {
    this.tasks = [...initialTasks];
  }

  async create({ title, description }: CreateTaskInput): Promise<Task> {
    const now = new Date();
    const task: Task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: now,
      updated_at: now,
    };

    this.tasks.push(task);
    return task;
  }

  async findAll({ title, description }: TaskFilters = {}): Promise<Task[]> {
    return this.tasks.filter((task) => {
      const titleMatches = title
        ? task.title.toLowerCase().includes(title.toLowerCase())
        : true;

      const descriptionMatches = description
        ? task.description.toLowerCase().includes(description.toLowerCase())
        : true;

      return titleMatches && descriptionMatches;
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find((task) => task.id === id) ?? null;
  }

  async update(id: string, payload: UpdateTaskInput): Promise<Task | null> {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      return null;
    }

    if (payload.title !== undefined) {
      task.title = payload.title;
    }

    if (payload.description !== undefined) {
      task.description = payload.description;
    }

    task.updated_at = new Date();
    return task;
  }

  async remove(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  async toggleCompletion(id: string, completedAt: Date | null): Promise<Task | null> {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      return null;
    }

    task.completed_at = completedAt;
    task.updated_at = new Date();
    return task;
  }

  clear(): void {
    this.tasks = [];
  }
}
