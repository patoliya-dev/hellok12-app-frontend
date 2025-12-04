import { getUserTimezone } from "./timezone";

/**
 * Format a UTC ISO/string Date into user's local timezone friendly time.
 * utcIso can be an ISO string or Date object.
 * opts forwarded to toLocaleString (hour/minute/weekday etc.)
 */
export function formatUtcToLocal(utcIso, opts = {}) {
  if (!utcIso) return '';
  const tz = getUserTimezone();
  const d = typeof utcIso === 'string' ? new Date(utcIso) : utcIso;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, { timeZone: tz, ...opts });
}

/**
 * Format date part (YYYY-MM-DD) for a Date/ISO in user's timezone.
 * Useful for comparing "local" days.
 */
function localDateKey(utcIso) {
  const tz = getUserTimezone();
  const d = typeof utcIso === 'string' ? new Date(utcIso) : utcIso;
  if (Number.isNaN(d.getTime())) return '';
  // Using en-CA gives YYYY-MM-DD format
  return d.toLocaleDateString('en-CA', { timeZone: tz });
}

/**
 * Compare two dates (Date or ISO) for same local day in user's timezone.
 */
export function isSameLocalDay(a, b) {
  if (!a || !b) return false;
  return localDateKey(a) === localDateKey(b);
}

/**
 * Parse server session start (ISO string) to a Date object (UTC instant).
 * Returns Date or null.
 */
export function parseServerUtc(iso) {
  if (!iso) return null;
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return null;
  return d;
}
