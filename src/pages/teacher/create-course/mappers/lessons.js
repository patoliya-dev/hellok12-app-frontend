import { normalizeToHHMM24 } from "../../../../utils/time24h";
import { normalizeTime12h } from "../../../../utils/time12h";
import { formatDateForDateInput } from "../../../../utils/formatters";

// Map BE -> UI
export function mapLessonFromApi(l) {
  return {
    _id: l._id,
    title: l.title || "",
    description: l.description || "",
    isTrialAvailable: !!l.isTrialAvailable,
    trialCapacity: l.trialCapacity ?? "",
    order: typeof l.order === "number" ? l.order : undefined,
    schedule: {
      date: l?.schedule?.date ? l.schedule.date.slice(0, 10) : "", // yyyy-mm-dd
      time: l?.schedule?.time || "",
      duration: l?.schedule?.duration ?? "",
    },
  };
}

// Map UI -> BE (create)
export function mapLessonToCreatePayload(l) {
  // lesson.schedule.date expected already as "YYYY-MM-DD" string from Input[type=date]
  const date = typeof l?.schedule?.date === 'string'
    ? l.schedule.date
    : (l.schedule?.date ? formatDateForDateInput(l.schedule.date) : undefined);

  const time = normalizeToHHMM24(l.schedule?.time) || l.schedule?.time;
  return {
    title: l.title,
    description: l.description || undefined,
    isTrialAvailable: !!l.isTrialAvailable,
    trialCapacity: l.isTrialAvailable
      ? Number(l.trialCapacity || 0)
      : undefined,
    order: typeof l.order === "number" ? l.order : undefined,
    schedule: {
      date: date,
      time: time,
      duration: Number(l.schedule?.duration || 60),
    },
  };
}

// Build partial update for a single lesson (send only changed fields)
export function buildPartialUpdate(oldL, newL) {
  const patch = { lessonId: oldL._id };

  // ---------- Simple scalar fields ----------
  if (newL.title !== oldL.title) {
    patch.title = newL.title;
  }

  if ((newL.description || "") !== (oldL.description || "")) {
    patch.description = newL.description || "";
  }

  if (!!newL.isTrialAvailable !== !!oldL.isTrialAvailable) {
    patch.isTrialAvailable = !!newL.isTrialAvailable;
  }

  const newCap = newL.isTrialAvailable ? Number(newL.trialCapacity || 0) : undefined;
  const oldCap = oldL.isTrialAvailable ? Number(oldL.trialCapacity || 0) : undefined;
  if (newCap !== oldCap) {
    patch.trialCapacity = newCap;
  }

  if (typeof newL.order === "number" && newL.order !== oldL.order) {
    patch.order = newL.order;
  }

  // ---------- Schedule diff (date / time / duration) ----------
  const sOld = oldL.schedule || {};
  const sNew = newL.schedule || {};
  const schedule = {};

  // Normalize any date-like value to "YYYY-MM-DD"
  const normalizeDateOnly = (value) => {
    if (!value) return "";
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === "string") return value.slice(0, 10);
    return "";
  };

  const oldDateStr = normalizeDateOnly(sOld.date);
  const newDateStr = normalizeDateOnly(sNew.date);

  // Only patch date if the effective calendar day changed
  if (newDateStr && newDateStr !== oldDateStr) {
    schedule.date = new Date(newDateStr);
  }

  // Normalize time to 24h "HH:MM" to compare semantically
  const normalizeTimeTo24 = (val) => {
    if (!val) return "";
    const t24 = normalizeToHHMM24(val);
    if (t24) return t24;
    return String(val).trim();
  };

  const oldTimeRaw = sOld.time || "";
  const newTimeRaw = sNew.time || "";

  // UI time is kept in 12h; normalize for comparison
  const newTime12 = normalizeTime12h(newTimeRaw) || newTimeRaw;

  const oldTimeNorm24 = normalizeTimeTo24(oldTimeRaw);
  const newTimeNorm24 = normalizeTimeTo24(newTime12);

  // Only patch time if effective time-of-day changed
  if (newTimeNorm24 && newTimeNorm24 !== oldTimeNorm24) {
    schedule.time = newTime12; // keep sending 12h to BE; it accepts it
  }

  const newDur = Number(sNew.duration || 0);
  const oldDur = Number(sOld.duration || 0);
  if (newDur && newDur !== oldDur) {
    schedule.duration = newDur;
  }

  if (Object.keys(schedule).length) {
    patch.schedule = schedule;
  }

  // If nothing changed (only lessonId exists), return null so we filter it out
  return Object.keys(patch).length > 1 ? patch : null;
}
