import { Readable } from 'node:stream';
import { BODY_TOO_LARGE, parseJsonBody } from '../../src/http/json-body-parser.js';

describe('parseJsonBody', () => {
  it('returns empty object for empty body', async () => {
    const req = Readable.from([]) as unknown as import('node:http').IncomingMessage;
    const body = await parseJsonBody(req);
    expect(body).toEqual({});
  });

  it('returns empty object for whitespace body', async () => {
    const req = Readable.from([Buffer.from('   ')]) as unknown as import('node:http').IncomingMessage;
    const body = await parseJsonBody(req);
    expect(body).toEqual({});
  });

  it('parses valid JSON body', async () => {
    const req = Readable.from([Buffer.from('{"title":"A"}')]) as unknown as import('node:http').IncomingMessage;
    const body = await parseJsonBody(req);
    expect(body).toEqual({ title: 'A' });
  });

  it('returns null for invalid JSON body', async () => {
    const req = Readable.from([Buffer.from('{invalid')]) as unknown as import('node:http').IncomingMessage;
    const body = await parseJsonBody(req);
    expect(body).toBeNull();
  });

  it('returns BODY_TOO_LARGE when payload exceeds max bytes', async () => {
    const req = Readable.from([Buffer.from('123456')]) as unknown as import('node:http').IncomingMessage;
    const body = await parseJsonBody(req, { maxBytes: 5 });
    expect(body).toBe(BODY_TOO_LARGE);
  });
});
