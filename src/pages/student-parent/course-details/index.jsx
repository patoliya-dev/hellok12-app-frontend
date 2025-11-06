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

const PublicCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  // Mock course data (same as your JSX)
  const mockCourse = {
    id: id || "course-1",
    title: "Complete Spanish for Beginners",
    description:
      "Master Spanish from scratch with interactive lessons, real-world practice, and personalized feedback from native speakers.",
    fullDescription:
      "This comprehensive Spanish course is designed to take you from complete beginner to conversational level through structured lessons and immersive practice. Our methodology combines traditional language learning techniques with modern technology to create an engaging and effective learning experience.",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
    instructor: {
      id: "instructor-1",
      name: "Maria Rodriguez",
      title: "Professional Spanish Instructor",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      bio: "With over 10 years of experience teaching Spanish, Maria brings passion and expertise to every lesson. Certified in language education and fluent in multiple languages.",
      rating: 4.9,
      studentsCount: 1250,
      coursesCount: 8,
      languages: ["Spanish", "English", "Portuguese"],
      verified: true,
      expertise: [
        "Spanish Language",
        "Grammar",
        "Conversation",
        "Business Spanish",
        "Cultural Studies",
      ],
    },
    rating: 4.8,
    reviewCount: 234,
    price: 199,
    originalPrice: 299,
    duration: "8 weeks",
    language: "Spanish",
    level: "Beginner",
    hasTrialLesson: true,
    enrolledStudents: 1250,
    totalLessons: 24,
    completionRate: 92,
    category: "Languages",
    learningObjectives: [
      "Master essential Spanish vocabulary and phrases",
      "Develop confident speaking and listening skills",
      "Understand grammar rules and apply them correctly",
      "Engage in meaningful conversations with native speakers",
      "Read and write effectively in various contexts",
    ],
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to Spanish",
        description:
          "Learn basic greetings, alphabet, and pronunciation fundamentals",
        duration: "45 minutes",
        type: "video",
        isPreview: true,
        objectives: [
          "Master the Spanish alphabet",
          "Learn basic greetings",
          "Understand pronunciation rules",
        ],
        materials: [
          "Video lesson",
          "Practice exercises",
          "Pronunciation guide",
        ],
      },
      {
        id: "lesson-2",
        title: "Numbers and Colors",
        description: "Essential vocabulary for numbers 1-100 and common colors",
        duration: "40 minutes",
        type: "interactive",
        isPreview: false,
        objectives: [
          "Count from 1 to 100",
          "Identify and name colors",
          "Use numbers in context",
        ],
        materials: ["Interactive exercises", "Audio recordings", "Flashcards"],
      },
      {
        id: "lesson-3",
        title: "Family and Relationships",
        description:
          "Vocabulary and phrases related to family members and relationships",
        duration: "50 minutes",
        type: "video",
        isPreview: false,
        objectives: [
          "Name family members",
          "Describe relationships",
          "Use possessive pronouns",
        ],
        materials: ["Video content", "Grammar exercises", "Speaking practice"],
      },
      {
        id: "lesson-4",
        title: "Present Tense Verbs",
        description: "Master regular and irregular verbs in present tense",
        duration: "60 minutes",
        type: "interactive",
        isPreview: false,
        objectives: [
          "Conjugate regular verbs",
          "Learn common irregular verbs",
          "Form complete sentences",
        ],
        materials: [
          "Grammar explanations",
          "Conjugation practice",
          "Sentence building",
        ],
      },
      {
        id: "lesson-5",
        title: "Food and Dining",
        description: "Vocabulary for food, restaurants, and dining experiences",
        duration: "45 minutes",
        type: "video",
        isPreview: true,
        objectives: [
          "Order food in Spanish",
          "Describe tastes and preferences",
          "Navigate restaurant situations",
        ],
        materials: ["Dialogue videos", "Menu practice", "Role-play scenarios"],
      },
    ],
    schedule: {
      flexibility: "Self-paced with optional live sessions",
      liveSessionsPerWeek: 2,
      sessionDuration: "1 hour",
      timezone: "Multiple timezones available",
    },
    reviews: [
      {
        id: "review-1",
        name: "Jennifer Smith",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        comment:
          "Excellent course! Maria is an amazing instructor and the lessons are well-structured. I feel much more confident speaking Spanish now.",
        date: "2 weeks ago",
        progress: "Completed",
      },
      {
        id: "review-2",
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
        rating: 4,
        comment:
          "Great content and interactive exercises. The trial lesson convinced me to enroll in the full course.",
        date: "1 month ago",
        progress: "75% Complete",
      },
      {
        id: "review-3",
        name: "Emma Wilson",
        avatar: "https://randomuser.me/api/portraits/women/29.jpg",
        rating: 5,
        comment:
          "Best Spanish course I've taken online. The combination of video lessons and interactive practice is perfect.",
        date: "3 weeks ago",
        progress: "Completed",
      },
    ],
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCourse(mockCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnrollCourse = () =>
    navigate(getRolePath(authUser?.role || "student", `book-lesson/${id}?action=enroll`));

  const handleTrialLesson = () => {
    // alert('Trial lesson booking would be implemented here');
    setShowLessonModal(true);
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
          onTrial={handleTrialLesson}
        />

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <LessonList
                lessons={course.lessons}
                selectedLesson={selectedLesson}
              />
              <ReviewsSection
                reviews={course.reviews}
                rating={course.rating}
                reviewCount={course.reviewCount}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <EnrollmentSection
                  course={course}
                  onEnroll={handleEnrollCourse}
                  onTrial={handleTrialLesson}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Lesson Modal */}
      <LessonModal
        isOpen={showLessonModal}
        lessons={course.lessons}
        onClose={() => {
          setShowLessonModal(false);
        }}
        onTrial={() => {
          setShowLessonModal(false);
          navigate(getRolePath(authUser?.role || "student", `book-lesson/${id}?action=trial`));
        }}
      />
    </div>
  );
};

export default PublicCourseDetails;
