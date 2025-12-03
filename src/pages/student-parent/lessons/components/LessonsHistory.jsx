import { useState, useEffect, useMemo } from "react";
import LessonCard from "components/ui/LessonCard";
import { getStudentLessons } from "../../../../services/lessons/lesson.service";
import { Loader2 } from "lucide-react";

const LessonsHistory = ({ studentId, selectedCourse }) => {
  const [activeFilter, setActiveFilter] = useState("All Lessons");
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!studentId) return;

      setLoading(true);
      setError(null);

      try {
        const params = {
          view: "history",
          page: 1,
          limit: 100,
        };

        if (selectedCourse) {
          params.courseId = selectedCourse;
        }

        const response = await getStudentLessons(studentId, params);

        if (response.success && response.data?.lessons) {
          // Map API response to LessonCard format
          const mappedLessons = response.data.lessons.map((lesson) => ({
            _id: lesson.sessionId,
            title: lesson.lessonTitle,
            teacherName: lesson.teacher.name,
            teacherImage: lesson.teacher.profileImage || "/default-avatar.png",
            startTime: lesson.startTime,
            endTime: lesson.endTime,
            duration: lesson.duration,
            status:
              lesson.status === "completed"
                ? "Completed"
                : lesson.status === "cancelled"
                ? "Cancelled"
                : "Completed",
            type: lesson.lessonType === "1-on-1" ? "1-on-1" : "Group",
            modality:
              lesson.courseMode === "online" ? "Online Course" : "In-Person",
            tags: [
              ...(lesson.isTrialLesson ? ["Trial Lesson"] : []),
              ...(lesson.tags || []),
            ],
            courseTitle: lesson.courseTitle,
            description: lesson.description,
            ratings: lesson?.teacher?.rating,
          }));

          setLessons(mappedLessons);
        }
      } catch (err) {
        setError(err.message || "Failed to load lessons");
        console.error("Error fetching lesson history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [studentId, selectedCourse]);

  const filteredLessons = useMemo(() => {
    if (activeFilter === "All Lessons") return lessons;
    return lessons.filter((lesson) => lesson.status === activeFilter);
  }, [activeFilter, lessons]);

  const counts = useMemo(
    () => ({
      "All Lessons": lessons.length,
      Completed: lessons.filter((l) => l.status === "Completed").length,
      Cancelled: lessons.filter((l) => l.status === "Cancelled").length,
    }),
    [lessons]
  );

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
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {["All Lessons", "Completed", "Cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === filter
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            {filter} ({counts[filter]})
          </button>
        ))}
      </div>

      {filteredLessons.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">
            No {activeFilter.toLowerCase()} found
          </p>
          <p className="text-gray-500 mt-2">
            {selectedCourse
              ? "Try selecting a different course"
              : "Your lesson history will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonsHistory;
