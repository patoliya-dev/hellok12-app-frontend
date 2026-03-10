import { normalizeToHHMM24 } from "../../../../utils/time24h";
import { normalizeTime12h } from "../../../../utils/time12h";
import { formatDateForDateInput } from "../../../../utils/formatters";

const normalizeDateOnly = (value) => {
  if (!value) return "";
  if (value instanceof Date) return formatDateForDateInput(value);
  if (typeof value === "string") return value.slice(0, 10);
  return "";
};

// Map BE -> UI
export function mapLessonFromApi(l) {
  return {
    _id: l._id,
    title: l.title || "",
    description: l.description || "",
    assignedTeacher: l.teacherId || "",
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
  const date =
    typeof l?.schedule?.date === "string"
      ? l.schedule.date
      : l.schedule?.date
        ? formatDateForDateInput(l.schedule.date)
        : undefined;

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
    teacherId: l.assignedTeacher || undefined,
  };
}

// Build partial update for a single lesson (send only changed fields)
export function buildPartialUpdate(oldL, newL) {
  const patch = { lessonId: oldL._id };
  if (newL.title !== oldL.title) patch.title = newL.title;
  if ((newL.description || "") !== (oldL.description || ""))
    patch.description = newL.description || "";

  if (!!newL.isTrialAvailable !== !!oldL.isTrialAvailable)
    patch.isTrialAvailable = !!newL.isTrialAvailable;
  const newCap = newL.isTrialAvailable
    ? Number(newL.trialCapacity || 0)
    : undefined;
  const oldCap = oldL.isTrialAvailable
    ? Number(oldL.trialCapacity || 0)
    : undefined;
  if (newCap !== oldCap) patch.trialCapacity = newCap;

  if (typeof newL.order === "number" && newL.order !== oldL.order)
    patch.order = newL.order;

  const sOld = oldL.schedule || {},
    sNew = newL.schedule || {};
  const schedule = {};
  const oldDateStr = normalizeDateOnly(sOld.date);
  const newDateStr = normalizeDateOnly(sNew.date);
  if (newDateStr && newDateStr !== oldDateStr) schedule.date = newDateStr;
  const normTime = normalizeTime12h(sNew.time);
  if ((normTime || "") !== (sOld.time || "")) schedule.time = normTime;
  const newDur = Number(sNew.duration || 0),
    oldDur = Number(sOld.duration || 0);
  if (newDur && newDur !== oldDur) schedule.duration = newDur;

  if (Object.keys(schedule).length) patch.schedule = schedule;

  // If nothing changed, return null so we can filter it out.
  return Object.keys(patch).length > 1 ? patch : null;
}
