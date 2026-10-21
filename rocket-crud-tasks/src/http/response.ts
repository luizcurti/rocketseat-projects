import type { ServerResponse } from 'node:http';

export const sendJson = (res: ServerResponse, statusCode: number, payload: unknown): void => {
  if (statusCode === 204) {
    res.writeHead(statusCode);
    res.end();
    return;
  }

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};
