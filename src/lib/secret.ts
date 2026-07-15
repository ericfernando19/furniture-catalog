const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET);
}

export const COOKIE_NAME = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day
