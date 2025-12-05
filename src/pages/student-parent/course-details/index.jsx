import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "../../../components/ui/Icon";
import Button from "../../../components/ui/Button";
import CourseHero from "../../../components/courseDetails/CourseHero";
import LessonList from "../../../components/courseDetails/LessonList";
import EnrollmentSection from "../../../components/courseDetails/EnrollmentSection";
import ReviewsSection from "../../../components/courseDetails/ReviewsSection";
import LessonModal from "../../../components/courseDetails/LessonModal";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../../utils/rolePath";
import {
  getCourseDetails,
  getFeedbacks,
} from "../../../services/courses/course.service";
import { errorToast } from "../../../utils/utils";

const PublicCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCourseDetails(id);
        setCourse(data);
      } catch (error) {
        errorToast(error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnrollCourse = () =>
    navigate(
      getRolePath(
        authUser?.role || "student",
        `book-lesson/${id}?action=enroll`
      )
    );

  // onTrial now expects a lessonId argument from the modal
  const handleTrialLesson = (selectedLessonId) => {
    // close modal (modal will call onClose itself in most paths, but ensure it's closed)
    setShowLessonModal(false);

    // if no lesson id provided, fallback to regular trial navigation without lesson
    const lessonQuery = selectedLessonId ? `&lessonId=${selectedLessonId}` : "";
    navigate(
      getRolePath(
        authUser?.role || "student",
        `book-lesson/${id}?action=trial${lessonQuery}`
      )
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Page title */}
        <RoleBasedHeader />
        <div className="pt-18">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-8 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="h-64 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader />
        <div className="pt-18">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center py-12">
              <Icon
                name="AlertCircle"
                size={48}
                className="text-muted-foreground mx-auto mb-4"
              />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Course Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                {
                  "The course you're looking for doesn't exist or is no longer available."
                }
              </p>
              <Button onClick={() => navigate("/")}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <div className="pt-18">
        <CourseHero
          course={course}
          onEnroll={handleEnrollCourse}
          onTrial={() => setShowLessonModal(true)}
        />

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <LessonList
                lessons={course?.lessons}
                selectedLesson={selectedLesson}
              />
              <ReviewsSection id={id} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <EnrollmentSection
                  course={course}
                  onEnroll={handleEnrollCourse}
                  onTrial={() => setShowLessonModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      <LessonModal
        isOpen={showLessonModal}
        lessons={course?.lessons || []}
        teachers={course?.teachers || []}
        onClose={() => {
          setShowLessonModal(false);
        }}
        // handleTrial now accepts a selectedLessonId from modal and navigates with it
        onTrial={(selectedLessonId) => handleTrialLesson(selectedLessonId)}
      />
    </div>
  );
};

export default PublicCourseDetails;
