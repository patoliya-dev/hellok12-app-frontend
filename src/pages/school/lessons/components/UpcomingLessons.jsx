import { useState, useEffect, useCallback } from "react";
import LessonCard from "components/ui/LessonCard";
import { getSchoolLessons } from "../../../../services/lessons/lesson.service";
import { Loader2 } from "lucide-react";
import { formatAddressOneLine } from "../../../../utils/utils";

const safeUrl = (v) => (typeof v === "string" && v.trim() ? v.trim() : "");

const UpcomingLessons = ({ selectedCourse }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const params = { view: "upcoming", page: 1, limit: 50 };
      if (selectedCourse) params.courseId = selectedCourse;

      const response = await getSchoolLessons(params, { signal: ctrl.signal });

      if (response?.success && response?.data?.lessons) {
        const mappedLessons = response.data.lessons.map((lesson) => {
          const meetingUrl = safeUrl(lesson.meetingUrl || lesson.joinUrl);

          return {
            _id: lesson.sessionId,
            title: lesson.lessonTitle,
            teacherId: lesson.teacher?._id,
            teacherName: lesson.teacher?.name || "Teacher",
            teacherImage: lesson.teacher?.profileImage,
            startTime: lesson.startTime,
            endTime: lesson.endTime,
            duration: lesson.duration,
            status: "Upcoming",
            type: lesson.lessonType === "1-on-1" ? "1-on-1" : "Group",
            modality:
              lesson.courseMode === "online" ? "Online Course" : "In-Person",
            tags: [
              ...(lesson.isTrialLesson ? ["Trial Lesson"] : []),
              ...(lesson.tags || []),
            ],
            courseTitle: lesson.courseTitle,
            // important for Join CTA in LessonCard
            meetingUrl,
            description: lesson.description,
            ratings: lesson?.teacher?.rating,
            address: lesson?.address
              ? formatAddressOneLine(lesson.address)
              : null,
          };
        });

        setLessons(mappedLessons);
      } else {
        setLessons([]);
      }
    } catch (err) {
      if (err?.name !== "AbortError" && err?.name !== "CanceledError") {
        setError(err?.message || "Failed to load lessons");
        console.error("Error fetching school upcoming lessons:", err);
      }
    } finally {
      setLoading(false);
    }

    return () => ctrl.abort();
  }, [selectedCourse]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchLessons}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-600 text-lg font-medium">
          No upcoming lessons found
        </p>
        <p className="text-gray-500 mt-2">
          {selectedCourse
            ? "Try selecting a different course"
            : "Upcoming lessons will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <LessonCard key={lesson._id} lesson={lesson} onRefresh={fetchLessons} />
      ))}
    </div>
  );
};

export default UpcomingLessons;
