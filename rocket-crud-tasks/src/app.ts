import http from 'node:http';
import { createTasksRoutes } from './http/routes/tasks-routes.js';
import { sendJson } from './http/response.js';
import {
  createMetrics,
  createRequestLogger,
  nextRequestId,
  trackMetrics,
  type Metrics,
} from './utils/observability.js';
import { createRateLimiter, type RateLimitSettings } from './utils/rate-limit.js';
import type { TaskService } from './services/task-service.js';

interface AppOptions {
  taskService: TaskService;
  healthCheck?: () => Promise<Record<string, unknown>>;
  requestTimeoutMs?: number;
  rateLimitSettings?: RateLimitSettings;
}

const getClientIp = (req: http.IncomingMessage): string => {
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  /* istanbul ignore next */
  return req.socket?.remoteAddress ?? 'unknown';
};

export const createApp = ({
  taskService,
  healthCheck = async () => ({ status: 'ok' }),
  requestTimeoutMs = 10_000,
  rateLimitSettings,
}: AppOptions): http.Server => {
  const tasksRoutes = createTasksRoutes(taskService);
  const metrics: Metrics = createMetrics();
  const logger = createRequestLogger();
  const rateLimiter = createRateLimiter(rateLimitSettings);

  const server = http.createServer(async (req, res) => {
    const start = Date.now();
    const requestId = nextRequestId();
    const clientIp = getClientIp(req);
    /* istanbul ignore next */
    const routeKey = `${req.method} ${req.url ?? ''}`;    

    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      const latencyMs = Date.now() - start;
      trackMetrics(metrics, { routeKey, statusCode: res.statusCode });
      /* istanbul ignore next */
      const logMethod = req.method ?? '';
      /* istanbul ignore next */
      const logRoute = req.url ?? '';
      logger.info({
        request_id: requestId,
        method: logMethod,
        route: logRoute,
        status_code: res.statusCode,
        latency_ms: latencyMs,
        client_ip: clientIp,
      });
    });

    const rate = rateLimiter.isLimited(clientIp);

    if (rate.limited) {
      res.setHeader('Retry-After', String(rate.retryAfterSeconds));
      sendJson(res, 429, { message: 'Too many requests.' });
      return;
    }

    if (req.method === 'GET' && req.url === '/metrics') {
      sendJson(res, 200, metrics);
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      const health = await healthCheck();
      const isHealthy = health?.status === 'ok';

      sendJson(res, isHealthy ? 200 : 503, {
        service: 'tasks-api',
        timestamp: new Date().toISOString(),
        ...health,
      });
      return;
    }

    try {
      await tasksRoutes(req, res);
    } catch (error) {
      /* istanbul ignore next */
      const errMethod = req.method ?? '';
      /* istanbul ignore next */
      const errRoute = req.url ?? '';
      logger.error({
        request_id: requestId,
        method: errMethod,
        route: errRoute,
        message: (error as Error).message,
      });

      sendJson(res, 500, { message: 'Internal server error.' });
    }
  });

  server.requestTimeout = requestTimeoutMs;
  server.headersTimeout = requestTimeoutMs + 1_000;

  return server;
};
