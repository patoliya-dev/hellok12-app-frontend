// src/utils/timezone.js
export function getUserTimezone(authUser) {
  // Prefer explicit timezone from the logged-in user profile (if you store it).
  // If not available, fallback to browser-detected tz.
  if (authUser?.timezone) return authUser.timezone;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function formatTimeToTZ(isoString, timeZone, opts = {}) {
  if (!isoString) return '';
  // isoString should be a full ISO with timezone (Z). e.g. "2025-12-03T11:30:00.000Z"
  const date = new Date(isoString);
  // default options
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...opts
  };
  return date.toLocaleTimeString(undefined, { ...options, timeZone });
}

export function formatDateToTZ(isoString, timeZone, opts = {}) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts
  };
  return date.toLocaleDateString(undefined, { ...options, timeZone });
}
