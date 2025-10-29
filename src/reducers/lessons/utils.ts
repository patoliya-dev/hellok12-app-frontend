// utils.ts
export function extractFieldErrorsFromPayload(payload: any) {
  // Preferred: payload.details.fields (already normalized)
  if (payload?.details?.fields) return payload.details.fields;

  // BE currently sends stringified JSON in payload.error
  const raw = payload?.error;
  if (typeof raw === 'string' && (raw.trim().startsWith('[') || raw.trim().startsWith('{'))) {
    try {
      const parsed = JSON.parse(raw);
      // Accept either { fields: [...] } or a raw array
      if (Array.isArray(parsed)) return parsed;
      if (parsed?.fields && Array.isArray(parsed.fields)) return parsed.fields;
    } catch {
      /* ignore parse error */
    }
  }
  return null;
}

export function extractMessage(payload: any, fallback = 'Failed to create lessons') {
  // Prefer backend message if provided
  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message;
  }
  // If BE sent stringified array in `error`, show a compact generic message
  if (typeof payload?.error === 'string' && payload.error.trim()) {
    return 'Validation failed';
  }
  return fallback;
}
