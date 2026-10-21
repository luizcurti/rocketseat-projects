interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface RateLimiter {
  isLimited(key: string): RateLimitResult;
}

export interface RateLimitSettings {
  maxRequests?: number;
  windowMs?: number;
}

export const createRateLimiter = ({
  maxRequests = 120,
  windowMs = 60_000,
}: RateLimitSettings = {}): RateLimiter => {
  const store = new Map<string, RateLimitEntry>();

  const isLimited = (key: string): RateLimitResult => {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { limited: false, remaining: maxRequests - 1, retryAfterSeconds: 0 };
    }

    if (entry.count >= maxRequests) {
      return {
        limited: true,
        remaining: 0,
        retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
      };
    }

    entry.count += 1;

    return {
      limited: false,
      remaining: maxRequests - entry.count,
      retryAfterSeconds: 0,
    };
  };

  return { isLimited };
};
