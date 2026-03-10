import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import Minicalendar from "./components/MiniCalendar";
import TimeSlots from "./components/TimeSlots";
import { timeSlots } from "./data";
import {
  fetchSchedule,
  saveSchedule,
  fetchSlotsForDate,
  fetchSlotsForMonth,
  updateDateSlots,
} from "../../../reducers/schedule/scheduleThunks";
import { errorToast, successToast } from "../../../utils/utils";
import { dayStrToIdx, idxToDayStr, isHHMM, isNumber, minutesToHHMM, toHHMM, toISO, weekdayKeys } from "../../../utils/time12h";
import { selectPageLoading } from "../../../reducers/ui/pageLoaderSlice";
import PageLoaderOverlay from "components/ui/PageLoaderOverlay";

const EMPTY_MONTHLY_WEEKLY = {};

const ManageSchedule = () => {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const teacherId = auth?.user?._id || auth?.user?.id;

  const scheduleState = useSelector((s) => s.schedule);
  const pageLoading = useSelector(selectPageLoading);

  // selected day/date state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateISO, setSelectedDateISO] = useState(null); // null => weekly mode
  const [selectedWeekday, setSelectedWeekday] = useState(weekdayKeys[new Date().getDay()]);
  // visible month (YYYY-MM) for calendar view
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleVisibleMonthChange = useCallback((monthKey) => {
    if (!monthKey) return;
    setVisibleMonth((prev) => (prev === monthKey ? prev : monthKey));
  }, []);

  const slotsByMonth = useSelector((s) => s.schedule.slotsByMonth || {}); // { 'YYYY-MM': { monthlyWeekly, overrides, slotsByDate } }
  const visibleMonthCache = slotsByMonth?.[visibleMonth];
  const scheduleMonthly = scheduleState?.schedule?.monthly || {};

  // month baseline from month API cache (preferred)
  const monthlyWeeklyBaseline = visibleMonthCache?.monthlyWeekly;
  const hasMonthBaselineFromApi = useMemo(() => {
    return (
      !!monthlyWeeklyBaseline &&
      typeof monthlyWeeklyBaseline === "object" &&
      Object.keys(monthlyWeeklyBaseline).length > 0
    );
  }, [monthlyWeeklyBaseline]);

  // safe fallback from full schedule payload for initial prefill when month cache is not hydrated yet
  const fallbackMonthlyBaseline = useMemo(() => {
    const monthEntry = scheduleMonthly?.[visibleMonth];
    if (!monthEntry || typeof monthEntry !== "object") return null;

    const out = {};
    Object.entries(monthEntry).forEach(([k, arr]) => {
      if (!Array.isArray(arr)) {
        out[k] = [];
        return;
      }
      out[k] = arr.map((v) => {
        if (isHHMM(v)) return v;
        if (isNumber(v)) return minutesToHHMM(v);
        return null;
      }).filter(Boolean);
    });
    return out;
  }, [scheduleMonthly, visibleMonth]);

  const effectiveMonthlyWeeklyBaseline =
    hasMonthBaselineFromApi ? monthlyWeeklyBaseline : fallbackMonthlyBaseline;

  // availability
  const [availability, setAvailability] = useState({
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  });

  // ---- initial load schedule ----
  useEffect(() => {
    if (!teacherId) return;
    dispatch(fetchSchedule(teacherId))
      .unwrap()
      .catch((err) => {
        errorToast(err?.message || "Failed to fetch schedule");
      });
  }, [dispatch, teacherId]);

  // Fetch month data when visibleMonth changes (if not cached)
  useEffect(() => {
    if (!teacherId || !visibleMonth) return;
    // Do not skip if cache came only from date-level fetch and monthly baseline is still missing.
    if (hasMonthBaselineFromApi) return;
    dispatch(fetchSlotsForMonth({ teacherId, month: visibleMonth }))
      .unwrap()
      .catch((err) => {
        // fall back to per-date loads if month endpoint fails
      });
  }, [visibleMonth, teacherId, dispatch, hasMonthBaselineFromApi]);

  // Keep refs to latest state to avoid stale closures inside handlers
  const visibleMonthRef = useRef(visibleMonth);
  useEffect(() => { visibleMonthRef.current = visibleMonth; }, [visibleMonth]);
  const selectedDateISORef = useRef(selectedDateISO);
  useEffect(() => { selectedDateISORef.current = selectedDateISO; }, [selectedDateISO]);

  // ---- hydrate weekly availability from monthly baseline ONLY (accept minutes or HH:MM) ----
  useEffect(() => {
    const next = { sun: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] };

    // Use monthly baseline only. If there is no monthly baseline for the visible month,
    // availability remains empty (we don't use legacy weekly or previous month).
    const baseline = effectiveMonthlyWeeklyBaseline || EMPTY_MONTHLY_WEEKLY;

    Object.entries(baseline || {}).forEach(([k, arr]) => {
      const idx = Number(k);
      const key = idxToDayStr[idx];
      if (!key) return;

      const normalized = (arr || [])
        .map((item) => {
          if (isHHMM(item)) return item;
          if (isNumber(item)) return minutesToHHMM(item);
          return null;
        })
        .filter(Boolean);

      next[key] = normalized;
    });

    setAvailability((prev) => {
      const merged = { ...prev, ...next };
      const isSame = weekdayKeys.every((k) => {
        const a = prev[k] || [];
        const b = merged[k] || [];
        if (a.length !== b.length) return false;
        return a.every((v, i) => v === b[i]);
      });
      return isSame ? prev : merged;
    });
  }, [effectiveMonthlyWeeklyBaseline, visibleMonth]);

  // ---- pick/unpick date from MiniCalendar ----
  const handleDateSelect = (date) => {
    const iso = toISO(date);
    const clickedPast = new Date(iso) < new Date(toISO(new Date()));
    if (clickedPast) return; // guard, though MiniCalendar already disables

    if (selectedDateISO === iso) {
      // deselect -> back to weekly editing
      setSelectedDateISO(null);
      successToast("Deselected date");
    } else {
      // ensure visibleMonth aligns with selected date immediately (prevent stale month param)
      const monthKey = iso.slice(0, 7); // 'YYYY-MM'
      if (monthKey && monthKey !== visibleMonth) {
        // update visibleMonth first so subsequent handlers/readers use authoritative month
        setVisibleMonth(monthKey);
      }
      setSelectedDateISO(iso);
      // fetch that date’s slots (override) with authoritative monthKey
      const fetchMonthParam = monthKey || visibleMonthRef.current;
      dispatch(fetchSlotsForDate({ teacherId, date: iso, month: fetchMonthParam }))
        .unwrap()
        .catch((err) => errorToast(err?.error || "Failed to load date slots"));
    }
    setCurrentDate(date);
  };

  // slotsByDate for current visible month
  const currentMonthSlotsByDate = slotsByMonth?.[visibleMonth]?.slotsByDate || {};

  // update dayName based on selected weekday instead of current date
  const dayName = useMemo(() => {
    return selectedWeekday
      ? selectedWeekday.charAt(0).toUpperCase() + selectedWeekday.slice(1)
      : currentDate?.toLocaleDateString("en-US", { weekday: "short" });
  }, [selectedWeekday, currentDate]);

  // ---- WEEKLY: toggle single time for currently selected weekday (local only) ----
  const handleAvailabilitySelect = (time) => {
    const day = dayName.toLowerCase();
    setAvailability((prev) => {
      if (prev[day].includes(time)) {
        return { ...prev, [day]: prev[day].filter((t) => t !== time) };
      }
      return { ...prev, [day]: [...prev[day], time] };
    });
  };

  // ---- WEEKLY: select/clear all for a day ----
  const toggleAllSlotsForDay = (day) => {
    setAvailability((prev) => {
      const isAllSelected = (prev?.[day] || []).length === timeSlots.length;
      return {
        ...prev,
        [day]: isAllSelected ? [] : [...timeSlots],
      };
    });
  };

  // ---- WEEKLY: clear all days ----
  const handleClearAll = () => {
    setAvailability({
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    });
  };

  // ---- SAVE WEEKLY ----
  const handleSaveWeekly = useCallback(async () => {
    try {
      const weeklyStrings = {};
      Object.entries(availability).forEach(([dayStr, arr]) => {
        const idx = dayStrToIdx[dayStr];
        if (idx === undefined) return;
        weeklyStrings[idx] = (arr || []).slice(); // HH:MM strings
      });

      // Determine authoritative monthKey to save under.
      // Priority: selected date (selectedDateISO) -> visibleMonth -> currentDate fallback
      let monthKey = null;
      if (selectedDateISO) {
        monthKey = String(selectedDateISO).slice(0, 7);
      } else if (visibleMonth) {
        monthKey = visibleMonth;
      } else if (currentDate) {
        const d = new Date(currentDate);
        monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }

      const body = {
        slotMinutes: undefined,
        month: monthKey,
        weekly: weeklyStrings,
      };

      await dispatch(saveSchedule({ teacherId, body })).unwrap();
      // refresh month data
      if (monthKey) dispatch(fetchSlotsForMonth({ teacherId, month: monthKey })).catch(() => { });
      successToast("Schedule saved successfully!");
    } catch (err) {
      errorToast(err?.error || "Failed to save schedule");
    }
  }, [availability, dispatch, teacherId, visibleMonth, selectedDateISO, currentDate]);

  // Determine if we already have an override entry for this date (only for current visible month)
  const hasOverrideFor = useCallback((iso) => {
    return Object.prototype.hasOwnProperty.call(currentMonthSlotsByDate || {}, iso);
  }, [currentMonthSlotsByDate]);


  // Unified slot handler: prefer explicit add/remove (server-side will still accept toggle),
  // but we avoid using 'toggle' to keep payload explicit and deterministic.
  const handleToggleOverride = useCallback(async (hhmm) => {
    const selectedIso = selectedDateISORef.current;
    if (!selectedIso) return;

    try {
      // authoritative month for this action
      const actionMonth = selectedIso.slice(0, 7) || visibleMonthRef.current;

      // compute source-of-truth locally
      const overrideExists = hasOverrideFor(selectedIso);
      const currentOverrideSlots = (currentMonthSlotsByDate[selectedIso] || []).map(s => (typeof s === 'string' ? s : (s.label || toHHMM(s.minutes))));
      const baselineForDate = effectiveSlotsForDate(selectedIso); // uses monthly baseline only
      const source = overrideExists ? currentOverrideSlots : baselineForDate;

      const isCurrentlySelected = (source || []).includes(hhmm);

      // prefer explicit add/remove; server patchDateSlots will handle safe delta merging
      const payload = {
        date: selectedIso,
        [isCurrentlySelected ? 'remove' : 'add']: [hhmm]
      };

      await dispatch(updateDateSlots({ teacherId, body: payload })).unwrap();

      // refresh month data to reflect new override/state
      if (actionMonth) {
        dispatch(fetchSlotsForMonth({ teacherId, month: actionMonth })).catch(() => { });
      }

      successToast(`Updated ${selectedIso} — ${isCurrentlySelected ? 'removed' : 'added'} slot ${hhmm}`);
    } catch (err) {
      errorToast(err?.error || 'Failed to update date slot');
    }
  }, [dispatch, teacherId, hasOverrideFor, currentMonthSlotsByDate]);

  // ---- derive slots for TimeSlots: weekly vs override ----

  const effectiveSlotsForDate = (iso) => {
    // 1) If override exists for this date (in current visible month) -> return it
    const overrideRaw = currentMonthSlotsByDate?.[iso];
    if (overrideRaw) {
      if (overrideRaw.length && typeof overrideRaw[0] === 'string') return overrideRaw;
      return overrideRaw.map((it) => (typeof it === 'string' ? it : (it.label || toHHMM(it.minutes))));
    }

    // 2) Otherwise, use monthly baseline only - if monthly baseline missing -> return empty []
    const d = new Date(iso + "T00:00:00Z");
    const dow = d.getUTCDay(); // 0..6
    const weeklyArr = effectiveMonthlyWeeklyBaseline?.[dow] || [];

    return weeklyArr.map((x) => (isHHMM(x) ? x : minutesToHHMM(x)));
  };

  // handle weekday click → weekly editing mode
  const handleWeekdaySelect = (dayKey) => {
    setSelectedWeekday(dayKey);
    setSelectedDateISO(null); // exit override mode
    successToast(`Editing weekly schedule for ${dayKey.toUpperCase()}`);
  };

  const showPageLoader = scheduleState.loading && !scheduleState.schedule;

  return (
    <div className="min-h-screen bg-background">
      <PageLoaderOverlay show={pageLoading} label="Loading schedule…" />
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Manage Schedule
              </h1>
              <p className="text-muted-foreground">
                Manage your teaching lessons and student bookings
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
              {showPageLoader && (
                <div className="w-full py-10 text-center text-sm text-muted-foreground">
                  Loading schedule…
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground">Set Availability</h3>
                <p className="text-muted-foreground">
                  Set your available hours for each day of the week. Click on time slots to toggle availability.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <Minicalendar
                  currentDate={currentDate}
                  onDateSelect={handleDateSelect} // override mode
                  onWeekdaySelect={handleWeekdaySelect} // weekly mode
                  onVisibleMonthChange={handleVisibleMonthChange}
                  selectedWeekday={selectedWeekday}
                  selectedDateISO={selectedDateISO} // inform MiniCalendar of date-edit mode
                />
                <TimeSlots
                  selectedDay={dayName}
                  selectedDate={currentDate}
                  // weekly editing local state
                  availability={availability}
                  setAvailability={
                    selectedDateISO
                      ? (hhmm, wasSelected) => handleToggleOverride(hhmm, wasSelected) // instant API
                      : handleAvailabilitySelect               // local only
                  }
                  toggleAllSlotsForDay={toggleAllSlotsForDay}
                  handleClearAll={handleClearAll}
                  onSaveWeekly={handleSaveWeekly}
                  saving={scheduleState.loading}
                  isOverrideMode={!!selectedDateISO}
                  overrideSlots={selectedDateISO ? effectiveSlotsForDate(selectedDateISO) : []}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <AvailabilityCalendar
                availability={availability}
                currentDate={currentDate}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageSchedule;
