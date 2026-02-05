/**
 * Booking Confirmation Helpers
 */
const safeStr = (v) => (typeof v === "string" ? v : "");
const safeNum = (v, fallback = 0) =>
  Number.isFinite(Number(v)) ? Number(v) : fallback;

const toDate = (v) => {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

const formatDateLong = (date) => {
  if (!date) return "-";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTimeShort = (date) => {
  if (!date) return "-";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const minutesBetween = (start, end) => {
  if (!start || !end) return null;
  const diffMs = end.getTime() - start.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return null;
  return Math.round(diffMs / 60000);
};

const parseScheduleFallbackStart = (lesson) => {
  // fallback: schedule.date + schedule.time (HH:mm)
  const dateStr = safeStr(lesson?.schedule?.date);
  const timeStr = safeStr(lesson?.schedule?.time); // "12:00"
  if (!dateStr) return null;

  const base = toDate(dateStr);
  if (!base) return null;

  if (timeStr && /^\d{2}:\d{2}$/.test(timeStr)) {
    const [hh, mm] = timeStr.split(":").map((x) => Number(x));
    if (Number.isFinite(hh) && Number.isFinite(mm)) {
      const d = new Date(base);
      d.setHours(hh, mm, 0, 0);
      return d;
    }
  }

  // if no time, just return midnight date
  return base;
};

const getLessonStartEnd = (lesson) => {
  const start =
    toDate(lesson?.startAt) || parseScheduleFallbackStart(lesson) || null;

  const end = toDate(lesson?.endAt) || null;

  return { start, end };
};

const pickNextUpcomingLesson = (lessons = []) => {
  const now = new Date();

  const normalized = (Array.isArray(lessons) ? lessons : [])
    .map((l) => {
      const { start, end } = getLessonStartEnd(l);
      return { raw: l, start, end };
    })
    .filter((x) => x.start); // must have a start

  // upcoming (start >= now)
  const upcoming = normalized
    .filter((x) => x.start.getTime() >= now.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (upcoming.length) return upcoming[0];

  // fallback: earliest by start time
  const earliest = normalized.sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
  return earliest[0] || null;
};

export {
  safeStr,
  safeNum,
  toDate,
  formatDateLong,
  formatTimeShort,
  minutesBetween,
  pickNextUpcomingLesson,
};
