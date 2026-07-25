export const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const stripNewlines = (value) => String(value).replace(/[\r\n]/g, '');

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

export function createRateLimiter() {
  const map = new Map();
  return function isRateLimited(ip) {
    const now = Date.now();
    const record = map.get(ip);
    if (!record || now - record.start > RATE_LIMIT_WINDOW_MS) {
      map.set(ip, { start: now, count: 1 });
      return false;
    }
    record.count++;
    return record.count > RATE_LIMIT_MAX;
  };
}
