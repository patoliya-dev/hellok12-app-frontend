import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { useSelector } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../../utils/rolePath";
import TeacherHero from "../../../components/teacherProfileDetails/TeacherHero";
import TabNavigation from "../../../components/teacherProfileDetails/TabNavigation";
import AboutTab from "../../../components/teacherProfileDetails/AboutTab";
import CoursesTab from "../../../components/teacherProfileDetails/CoursesTab";
import ReviewsTab from "../../../components/teacherProfileDetails/ReviewsTab";
import { mockClasses, mockReviews } from "../../../services/mockApi";
import TeachingHighlightsManagement from "../../../components/teachingHighlightsManagement";
import RoleBasedHeader from "components/ui/RoleBasedHeader";

const TeacherProfileDetail = () => {
  const [activeTab, setActiveTab] = useState("about");
  const currentUser = useSelector(selectAuthUser);

  const courses = mockClasses;

  const teacher = {
    id: "teacher-001",
    name: "María García",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    languages: ["English", "Spanish", "French"],
    rating: 4.8,
    reviewCount: 127,
    isOnline: true,
    isVerified: true,
    nextAvailable: "Today at 3:00 PM",
    experience: 8,
    studentsCount: 245,
    classesCount: 12,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  };

  // Mock reviews data
  const reviews = mockReviews;

  // Calculate rating distribution
  const ratingDistribution = reviews?.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const breadCrumbData = [
    {
      label: "Dashboard",
      path: getRolePath(currentUser?.role || "student", "dashboard"),
    },
    {
      label: "Find Teachers",
      path: getRolePath(currentUser?.role || "student", "find-teacher"),
    },
    { label: teacher?.name, path: "#", current: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <Breadcrumb customPath={breadCrumbData} />

          <TeacherHero teacher={teacher} />
        </div>

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          classesBadgeCount={courses?.length}
          reviewsBadgeCount={reviews?.length}
        />

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-12">
              {activeTab === "about" && <AboutTab teacher={teacher} />}
              {activeTab === "courses" && (
                <CoursesTab courses={courses} teacherId={teacher?.id} />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab
                  reviews={reviews}
                  overallRating={teacher?.rating}
                  ratingDistribution={ratingDistribution}
                />
              )}
              {activeTab === "highlights" && <TeachingHighlightsManagement />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfileDetail;
