import type { IncomingMessage, ServerResponse } from 'node:http';
import { BODY_TOO_LARGE, parseJsonBody } from '../json-body-parser.js';
import { sendJson } from '../response.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import type { TaskService } from '../../services/task-service.js';

const handleError = (res: ServerResponse, error: unknown): void => {
  if (error instanceof ValidationError) {
    sendJson(res, 400, { message: error.message });
    return;
  }

  if (error instanceof NotFoundError) {
    sendJson(res, 404, { message: error.message });
    return;
  }

  sendJson(res, 500, { message: 'Internal server error.' });
};

export const createTasksRoutes = (
  taskService: TaskService,
): ((req: IncomingMessage, res: ServerResponse) => Promise<void>) => {
  return async (req, res) => {
    /* istanbul ignore next */
    const rawUrl = req.url ?? '/';
    const url = new URL(rawUrl, 'http://localhost');
    const { pathname, searchParams } = url;

    if (req.method === 'POST' && pathname === '/tasks') {
      const body = await parseJsonBody(req);

      if (body === BODY_TOO_LARGE) {
        sendJson(res, 413, { message: 'Payload too large.' });
        return;
      }

      if (body === null) {
        sendJson(res, 400, { message: 'Invalid JSON body.' });
        return;
      }

      try {
        const task = await taskService.create(body);
        sendJson(res, 201, task);
        return;
      } catch (error) {
        handleError(res, error);
        return;
      }
    }

    if (req.method === 'GET' && pathname === '/tasks') {
      const title = searchParams.get('title') ?? undefined;
      const description = searchParams.get('description') ?? undefined;
      const tasks = await taskService.list({ title, description });
      sendJson(res, 200, tasks);
      return;
    }

    const taskIdMatch = pathname.match(/^\/tasks\/([a-f0-9-]+)$/i);

    if (taskIdMatch && req.method === 'PUT') {
      const body = await parseJsonBody(req);

      if (body === BODY_TOO_LARGE) {
        sendJson(res, 413, { message: 'Payload too large.' });
        return;
      }

      if (body === null) {
        sendJson(res, 400, { message: 'Invalid JSON body.' });
        return;
      }

      try {
        const updatedTask = await taskService.update(taskIdMatch[1], body);
        sendJson(res, 200, updatedTask);
        return;
      } catch (error) {
        handleError(res, error);
        return;
      }
    }

    if (taskIdMatch && req.method === 'DELETE') {
      try {
        await taskService.remove(taskIdMatch[1]);
        sendJson(res, 204, null);
        return;
      } catch (error) {
        handleError(res, error);
        return;
      }
    }

    const taskCompleteMatch = pathname.match(/^\/tasks\/([a-f0-9-]+)\/complete$/i);

    if (taskCompleteMatch && req.method === 'PATCH') {
      try {
        const task = await taskService.toggleCompletion(taskCompleteMatch[1]);
        sendJson(res, 200, task);
        return;
      } catch (error) {
        handleError(res, error);
        return;
      }
    }

    sendJson(res, 404, { message: 'Route not found.' });
  };
};
