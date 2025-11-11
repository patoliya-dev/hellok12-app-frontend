import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../../utils/rolePath";
import TeacherHero from "../../../components/teacherProfileDetails/TeacherHero";
import TabNavigation from "../../../components/teacherProfileDetails/TabNavigation";
import AboutTab from "../../../components/teacherProfileDetails/AboutTab";
import CoursesTab from "../../../components/teacherProfileDetails/CoursesTab";
import ReviewsTab from "../../../components/teacherProfileDetails/ReviewsTab";
import { mockReviews } from "../../../services/mockApi";
import TeachingHighlightsManagement from "../../../components/teachingHighlightsManagement";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { fetchDetails } from "../../../services/teachers/findTeachers.service";
import Loader from "components/ui/Loader";

const TeacherProfileDetail = () => {
  const [activeTab, setActiveTab] = useState("about");
  const currentUser = useSelector(selectAuthUser);
  const { id } = useParams();
  const [teacher, setTeacher] = useState({});
  const [loading, setLoading] = useState(false);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const response = await fetchDetails(id);
      const teacherDetails = response?.data || [];
      setTeacher(teacherDetails);
    } catch (err) {
      console.error("Failed to load teachers:", err);
      setTeachers({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

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

  return loading ? (
    <Loader />
  ) : (
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
          classesBadgeCount={teacher?.courses?.length}
          reviewsBadgeCount={reviews?.length}
        />

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-12">
              {activeTab === "about" && <AboutTab teacher={teacher} />}
              {activeTab === "courses" && (
                <CoursesTab
                  courses={teacher?.courses}
                  teacherId={teacher?._id}
                />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab
                  reviews={teacher?.feedbacks}
                  overallRating={teacher?.rating}
                  ratingDistribution={ratingDistribution}
                />
              )}
              {activeTab === "highlights" && (
                <TeachingHighlightsManagement
                  highlights={teacher?.highlights}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfileDetail;
