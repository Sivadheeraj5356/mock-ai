import { neon } from '@neondatabase/serverless';

// Persistent per-user rate limit backed by Neon, so the limit survives
// instance restarts and is shared across instances.
// Window: fixed 1-hour bucket. Limit: 20 AI requests per user per hour.
const HOURLY_LIMIT = 20;
// Global backstop across ALL users, so unlimited free signups cannot exhaust
// the provider's free quota and take the service down for everyone.
const GLOBAL_DAILY_LIMIT = 150;

const getSql = () => neon(process.env.DRIZZLE_DB_URL);

export const ensureRateLimitTable = async (sql) => {
  await sql`CREATE TABLE IF NOT EXISTS rate_limits (
    user_id text NOT NULL,
    window_start timestamptz NOT NULL,
    count integer NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, window_start)
  )`;
};

// Returns { allowed, remaining, retryAfterSeconds }
export const consumeAiRequest = async (userId) => {
  const sql = getSql();
  await ensureRateLimitTable(sql);
  const globalRows = await sql`
    SELECT COALESCE(SUM(count), 0)::int AS total FROM rate_limits
    WHERE window_start >= date_trunc('day', now())`;
  if ((globalRows[0]?.total ?? 0) >= GLOBAL_DAILY_LIMIT) {
    const retryAfterSeconds = Math.max(60, Math.ceil((new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds, global: true };
  }
  const rows = await sql`
    INSERT INTO rate_limits (user_id, window_start, count)
    VALUES (${userId}, date_trunc('hour', now()), 1)
    ON CONFLICT (user_id, window_start)
    DO UPDATE SET count = rate_limits.count + 1
    RETURNING count, window_start`;
  const count = rows[0]?.count ?? 1;
  const windowStart = rows[0]?.window_start;
  const retryAfterSeconds = windowStart
    ? Math.max(0, Math.ceil((new Date(windowStart).getTime() + 3600_000 - Date.now()) / 1000))
    : 3600;
  return { allowed: count <= HOURLY_LIMIT, remaining: Math.max(0, HOURLY_LIMIT - count), retryAfterSeconds };
};
