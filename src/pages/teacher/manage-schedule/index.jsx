import { useEffect, useMemo, useState, useCallback } from "react";
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
  updateDateSlots,
} from "../../../reducers/schedule/scheduleThunks";
import { errorToast, successToast } from "../../../utils/utils";
import { dayStrToIdx, idxToDayStr, isHHMM, isNumber, minutesToHHMM, toISO, weekdayKeys } from "../../../utils/time12h";
import { selectPageLoading } from "../../../reducers/ui/pageLoaderSlice";
import PageLoaderOverlay from "components/ui/PageLoaderOverlay";

const ManageSchedule = () => {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const teacherId = auth?.user?._id || auth?.user?.id;

  const scheduleState = useSelector((s) => s.schedule);
  const serverWeekly = useSelector((s) => s.schedule.schedule?.weekly) || {};; // may be minutes[] or HH:MM[]
  const pageLoading = useSelector(selectPageLoading);

  // selected day/date state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateISO, setSelectedDateISO] = useState(null); // null => weekly mode
  const [selectedWeekday, setSelectedWeekday] = useState(weekdayKeys[new Date().getDay()]);

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

  // ---- hydrate weekly availability from BE (accept minutes or HH:MM) ----
  useEffect(() => {
    const next = { sun: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] };

    Object.entries(serverWeekly || {}).forEach(([k, arr]) => {
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

    setAvailability((prev) => ({ ...prev, ...next }));
  }, [serverWeekly]);

  // ---- pick/unpick date from MiniCalendar ----
  const handleDateSelect = (date) => {
    const iso = toISO(date);
    const clickedPast = new Date(iso) < new Date(toISO(new Date()));
    if (clickedPast) return; // guard, though MiniCalendar already disables

    if (selectedDateISO === iso) {
      // deselect -> back to weekly editing
      setSelectedDateISO(null);
      successToast("Switched to weekly editing");
    } else {
      setSelectedDateISO(iso);
      // fetch that date’s slots (override) so TimeSlots can reflect instantly
      dispatch(fetchSlotsForDate({ teacherId, date: iso }))
        .unwrap()
        .catch((err) => errorToast(err?.message || "Failed to load date slots"));
    }
    setCurrentDate(date);
  };

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

      const body = {
        // uncomment to override slot length intentionally; else server keeps existing
        // slotMinutes: 45,
        weekly: weeklyStrings,
      };

      await dispatch(saveSchedule({ teacherId, body })).unwrap();
      successToast("Schedule saved successfully!");
    } catch (err) {
      errorToast(err?.message || "Failed to save schedule");
    }
  }, [availability, dispatch, teacherId]);

  // Determine if we already have an override entry for this date
  const hasOverrideFor = (iso) =>
    Object.prototype.hasOwnProperty.call(slotsByDate, iso);

  // Unified slot toggle handler for override (date-wise)
  const handleToggleOverride = async (hhmm) => {
    if (!selectedDateISO) return;

    try {
      const overrideExists = hasOverrideFor(selectedDateISO);
      const weeklyForDate = effectiveSlotsForDate(selectedDateISO); // normalized fallback
      const currentOverrideSlots = slotsByDate[selectedDateISO] || [];
      const isCurrentlySelected = (overrideExists
        ? currentOverrideSlots
        : weeklyForDate
      ).includes(hhmm);

      let payload = null;

      // Decide what type of operation to send:
      if (!overrideExists) {
        // First time editing this date → baseline comes from weekly schedule
        payload = {
          date: selectedDateISO,
          [isCurrentlySelected ? "remove" : "add"]: [hhmm],
        };
      } else {
        // Existing override → use toggle
        payload = {
          date: selectedDateISO,
          toggle: [hhmm],
        };
      }

      // Call API through Redux thunk
      await dispatch(updateDateSlots({ teacherId, body: payload })).unwrap();

      successToast(
        `Updated ${selectedDateISO} — ${isCurrentlySelected ? "removed" : "added"
        } slot ${hhmm}`
      );
    } catch (err) {
      errorToast(err?.message || "Failed to update date slot");
    }
  };

  // ---- derive slots for TimeSlots: weekly vs override ----
  const slotsByDate = useSelector((s) => s.schedule.slotsByDate || {});

  const effectiveSlotsForDate = (iso) => {
    // override exists?
    if (Object.prototype.hasOwnProperty.call(slotsByDate, iso)) {
      return slotsByDate[iso]; // may be [], which means: override exists and is empty
    }

    // fallback to weekly for that weekday
    const d = new Date(iso + "T00:00:00Z");
    const dow = d.getUTCDay(); // 0..6
    const weeklyArr = serverWeekly[dow] || [];

    // normalize to HH:MM for UI
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
                  selectedWeekday={selectedWeekday}
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
