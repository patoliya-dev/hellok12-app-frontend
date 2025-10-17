// src/pages/teacher/create-course/mappers/lessons.js
import { normalizeTime12h } from '../../../../utils/time12h';

// Map BE -> UI
export function mapLessonFromApi(l) {
  return {
    _id: l._id,
    title: l.title || '',
    description: l.description || '',
    isTrialAvailable: !!l.isTrialAvailable,
    trialCapacity: l.trialCapacity ?? '',
    order: typeof l.order === 'number' ? l.order : undefined,
    schedule: {
      date: l?.schedule?.date ? l.schedule.date.slice(0,10) : '', // yyyy-mm-dd
      time: l?.schedule?.time || '',
      duration: l?.schedule?.duration ?? ''
    },
  };
}

// Map UI -> BE (create)
export function mapLessonToCreatePayload(l) {
  return {
    title: l.title,
    description: l.description || undefined,
    isTrialAvailable: !!l.isTrialAvailable,
    trialCapacity: l.isTrialAvailable ? Number(l.trialCapacity || 0) : undefined,
    order: typeof l.order === 'number' ? l.order : undefined,
    schedule: {
      date: l.schedule?.date ? new Date(l.schedule.date) : new Date(),
      time: normalizeTime12h(l.schedule?.time),
      duration: Number(l.schedule?.duration || 60),
    },
  };
}

// Build partial update for a single lesson (send only changed fields)
export function buildPartialUpdate(oldL, newL) {
  const patch = { lessonId: oldL._id };
  if (newL.title !== oldL.title) patch.title = newL.title;
  if ((newL.description || '') !== (oldL.description || '')) patch.description = newL.description || '';

  if (!!newL.isTrialAvailable !== !!oldL.isTrialAvailable) patch.isTrialAvailable = !!newL.isTrialAvailable;
  const newCap = newL.isTrialAvailable ? Number(newL.trialCapacity || 0) : undefined;
  const oldCap = oldL.isTrialAvailable ? Number(oldL.trialCapacity || 0) : undefined;
  if (newCap !== oldCap) patch.trialCapacity = newCap;

  if (typeof newL.order === 'number' && newL.order !== oldL.order) patch.order = newL.order;

  const sOld = oldL.schedule || {}, sNew = newL.schedule || {};
  const schedule = {};
  if ((sNew.date || '') !== (sOld.date || '')) schedule.date = sNew.date ? new Date(sNew.date) : undefined;
  const normTime = normalizeTime12h(sNew.time);
  if ((normTime || '') !== (sOld.time || '')) schedule.time = normTime;
  const newDur = Number(sNew.duration || 0), oldDur = Number(sOld.duration || 0);
  if (newDur && newDur !== oldDur) schedule.duration = newDur;

  if (Object.keys(schedule).length) patch.schedule = schedule;

  // If nothing changed, return null so we can filter it out.
  return Object.keys(patch).length > 1 ? patch : null;
}
