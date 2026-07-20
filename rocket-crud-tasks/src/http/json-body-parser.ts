import type { IncomingMessage } from 'node:http';

export const BODY_TOO_LARGE: unique symbol = Symbol('BODY_TOO_LARGE');

export const parseJsonBody = async (
  req: IncomingMessage,
  { maxBytes = 1_048_576 }: { maxBytes?: number } = {},
): Promise<Record<string, unknown> | typeof BODY_TOO_LARGE | null> => {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buf = chunk as Buffer;
    totalBytes += buf.length;

    if (totalBytes > maxBytes) {
      return BODY_TOO_LARGE;
    }

    chunks.push(buf);
  }

  if (chunks.length === 0) {
    return {};
  }

  const bodyAsString = Buffer.concat(chunks).toString();

  if (!bodyAsString.trim()) {
    return {};
  }

  try {
    return JSON.parse(bodyAsString) as Record<string, unknown>;
  } catch {
    return null;
  }
};
