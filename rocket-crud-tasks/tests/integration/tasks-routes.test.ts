import request from 'supertest';
import { createApp } from '../../src/app.js';
import { InMemoryTaskRepository } from '../../src/repositories/in-memory-task-repository.js';
import { TaskService } from '../../src/services/task-service.js';
import type { Task } from '../../src/types.js';

describe('Tasks routes', () => {
  let repository: InMemoryTaskRepository;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    const taskService = new TaskService(repository);
    app = createApp({ taskService });
  });

  it('returns healthcheck payload', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('tasks-api');
    expect(response.body.timestamp).toBeTruthy();
  });

  it('returns degraded health when healthcheck fails', async () => {
    const degradedApp = createApp({
      taskService: new TaskService(new InMemoryTaskRepository()),
      healthCheck: async () => ({ status: 'degraded', database: 'down' }),
    });

    const response = await request(degradedApp).get('/health');

    expect(response.statusCode).toBe(503);
    expect(response.body.status).toBe('degraded');
    expect(response.body.database).toBe('down');
  });

  it('returns metrics payload', async () => {
    await request(app).get('/tasks');
    const response = await request(app).get('/metrics');

    expect(response.statusCode).toBe(200);
    expect(response.body.totalRequests).toBeGreaterThan(0);
    expect(response.body.routeHits['GET /tasks']).toBeGreaterThan(0);
  });

  it('creates a task through POST /tasks', async () => {
    const response = await request(app).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Task A');
  });

  it('returns 400 when JSON body is invalid', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send('{invalid');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid JSON body.');
  });

  it('returns 413 when payload is too large', async () => {
    const oversized = 'x'.repeat(1_100_000);

    const response = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ title: oversized, description: 'A' }));

    expect(response.statusCode).toBe(413);
    expect(response.body.message).toBe('Payload too large.');
  });

  it('returns 429 when request rate limit is exceeded', async () => {
    const limitedApp = createApp({
      taskService: new TaskService(new InMemoryTaskRepository()),
      rateLimitSettings: { maxRequests: 1, windowMs: 60_000 },
    });

    await request(limitedApp).get('/tasks');
    const response = await request(limitedApp).get('/tasks');

    expect(response.statusCode).toBe(429);
    expect(response.body.message).toBe('Too many requests.');
  });

  it('returns 400 when business validation fails on POST', async () => {
    const response = await request(app).post('/tasks').send({
      title: '',
      description: 'Description A',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain('title');
  });

  it('lists tasks with query filters', async () => {
    await request(app).post('/tasks').send({ title: 'My task', description: 'Alpha' });
    await request(app).post('/tasks').send({ title: 'Other', description: 'Beta' });

    const response = await request(app).get('/tasks?title=my');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('updates an existing task', async () => {
    const createResponse = await request(app).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    const response = await request(app)
      .put(`/tasks/${(createResponse.body as Task).id}`)
      .send({ description: 'Updated description' });

    expect(response.statusCode).toBe(200);
    expect(response.body.description).toBe('Updated description');
  });

  it('returns 404 when trying to update missing task', async () => {
    const response = await request(app)
      .put('/tasks/550e8400-e29b-41d4-a716-446655440000')
      .send({ description: 'Updated description' });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Task not found.');
  });

  it('returns 400 when PUT body is invalid JSON', async () => {
    const createResponse = await request(app).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    const response = await request(app)
      .put(`/tasks/${(createResponse.body as Task).id}`)
      .set('Content-Type', 'application/json')
      .send('{invalid');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid JSON body.');
  });

  it('deletes an existing task', async () => {
    const createResponse = await request(app).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    const response = await request(app).delete(`/tasks/${(createResponse.body as Task).id}`);

    expect(response.statusCode).toBe(204);

    const listResponse = await request(app).get('/tasks');
    expect(listResponse.body).toHaveLength(0);
  });

  it('returns 404 when deleting missing task', async () => {
    const response = await request(app).delete('/tasks/550e8400-e29b-41d4-a716-446655440000');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Task not found.');
  });

  it('toggles completion for an existing task', async () => {
    const createResponse = await request(app).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    const completeResponse = await request(app).patch(
      `/tasks/${(createResponse.body as Task).id}/complete`,
    );
    expect(completeResponse.statusCode).toBe(200);
    expect(completeResponse.body.completed_at).not.toBeNull();

    const pendingResponse = await request(app).patch(
      `/tasks/${(createResponse.body as Task).id}/complete`,
    );
    expect(pendingResponse.statusCode).toBe(200);
    expect(pendingResponse.body.completed_at).toBeNull();
  });

  it('returns 404 when toggling completion for missing task', async () => {
    const response = await request(app).patch(
      '/tasks/550e8400-e29b-41d4-a716-446655440000/complete',
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Task not found.');
  });

  it('returns 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Route not found.');
  });

  it('returns 500 when an unexpected error happens', async () => {
    const failingApp = createApp({
      taskService: {
        create: async () => {
          throw new Error('Unexpected failure');
        },
        list: async () => [],
        update: async () => { throw new Error('not used'); },
        remove: async () => {},
        toggleCompletion: async () => { throw new Error('not used'); },
      } as unknown as TaskService,
    });

    const response = await request(failingApp).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Internal server error.');
  });

  it('accepts x-forwarded-for header', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('x-forwarded-for', '1.2.3.4, 5.6.7.8');

    expect(response.statusCode).toBe(200);
  });

  it('returns 500 when list throws an unhandled error', async () => {
    const crashingApp = createApp({
      taskService: {
        create: async () => { throw new Error('not used'); },
        list: async () => { throw new Error('list crash'); },
        update: async () => { throw new Error('not used'); },
        remove: async () => {},
        toggleCompletion: async () => { throw new Error('not used'); },
      } as unknown as TaskService,
    });

    const response = await request(crashingApp).get('/tasks');
    expect(response.statusCode).toBe(500);
  });

  it('returns 413 when PUT payload is too large', async () => {
    const createResponse = await request(app).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    const oversized = 'x'.repeat(1_100_000);
    const response = await request(app)
      .put(`/tasks/${(createResponse.body as Task).id}`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ title: oversized }));

    expect(response.statusCode).toBe(413);
    expect(response.body.message).toBe('Payload too large.');
  });

  it('returns 400 when PUT body has no valid fields', async () => {
    const createResponse = await request(app).post('/tasks').send({
      title: 'Task A',
      description: 'Description A',
    });

    const response = await request(app)
      .put(`/tasks/${(createResponse.body as Task).id}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain('At least one field');
  });
});
