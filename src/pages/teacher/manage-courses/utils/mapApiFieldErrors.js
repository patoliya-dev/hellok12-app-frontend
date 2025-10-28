import { setIn } from "../../../../utils/utils";

export function applyLessonApiErrorsToForm(fieldErrors, setErrors) {
  if (!Array.isArray(fieldErrors) || !fieldErrors.length) return;

  // Build a patch object with nested paths:
  const patch = { lessons: [] };

  for (const f of fieldErrors) {
    const path = String(f.path || '');
    // normalize to bracket-index notation: lessons[0].schedule.time
    const normalized = path.replace(/\.([0-9]+)\./g, '[$1].');

    // Only map lesson-related errors to Step-2 UI
    if (!normalized.startsWith('lessons[')) continue;

    // write the message at the path inside `errors`
    // e.g., lessons[0].schedule.time -> set error message at that key
    setErrors(prev => setIn(prev || {}, normalized, f.message || 'Invalid'));
  }
}
