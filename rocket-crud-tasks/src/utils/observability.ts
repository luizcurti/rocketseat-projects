import { randomUUID } from 'node:crypto';

export interface Metrics {
  startedAt: string;
  totalRequests: number;
  totalErrors: number;
  routeHits: Record<string, number>;
  byStatusCode: Record<number, number>;
}

export interface RequestLogger {
  info(payload: Record<string, unknown>): void;
  error(payload: Record<string, unknown>): void;
}

export const createMetrics = (): Metrics => ({
  startedAt: new Date().toISOString(),
  totalRequests: 0,
  totalErrors: 0,
  routeHits: {},
  byStatusCode: {},
});

export const createRequestLogger = (): RequestLogger => ({
  info(payload) {
    console.log(JSON.stringify({ level: 'info', ...payload }));
  },
  error(payload) {
    console.error(JSON.stringify({ level: 'error', ...payload }));
  },
});

export const nextRequestId = (): string => randomUUID();

export const trackMetrics = (
  metrics: Metrics,
  { routeKey, statusCode }: { routeKey: string; statusCode: number },
): void => {
  metrics.totalRequests += 1;

  if (statusCode >= 400) {
    metrics.totalErrors += 1;
  }

  metrics.routeHits[routeKey] = (metrics.routeHits[routeKey] || 0) + 1;
  metrics.byStatusCode[statusCode] = (metrics.byStatusCode[statusCode] || 0) + 1;
};
