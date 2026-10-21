export interface Task {
  id: string;
  title: string;
  description: string;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface TaskFilters {
  title?: string;
  description?: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
}

export interface TaskRepository {
  create(input: CreateTaskInput): Promise<Task>;
  findAll(filters?: TaskFilters): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(id: string, payload: UpdateTaskInput): Promise<Task | null>;
  remove(id: string): Promise<void>;
  toggleCompletion(id: string, completedAt: Date | null): Promise<Task | null>;
}
