import { useState, useEffect } from "react";
import LessonCard from "components/ui/LessonCard";
import { getStudentLessons } from "../../../../services/lessons/lesson.service";
import { Loader2 } from "lucide-react";

const UpcomingLessons = ({ studentId, selectedCourse }) => {
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
          view: "upcoming",
          page: 1,
          limit: 50,
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
            status: "Upcoming",
            type: lesson.lessonType === "1-on-1" ? "1-on-1" : "Group",
            modality:
              lesson.courseMode === "online" ? "Online Course" : "In-Person",
            tags: [
              ...(lesson.isTrialLesson ? ["Trial Lesson"] : []),
              ...(lesson.tags || []),
            ],
            courseTitle: lesson.courseTitle,
            meetingUrl: lesson.meetingUrl,
            description: lesson.description,
            ratings: lesson?.teacher?.rating,
          }));

          setLessons(mappedLessons);
        }
      } catch (err) {
        setError(err.message || "Failed to load lessons");
        console.error("Error fetching upcoming lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [studentId, selectedCourse]);

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

  if (lessons.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-600 text-lg font-medium">
          No upcoming lessons found
        </p>
        <p className="text-gray-500 mt-2">
          {selectedCourse
            ? "Try selecting a different course or book a new lesson"
            : "Book your first lesson to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <LessonCard key={lesson._id} lesson={lesson} />
      ))}
    </div>
  );
};

export default UpcomingLessons;
