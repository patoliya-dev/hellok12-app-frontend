import { Routes, Route } from "react-router-dom";

import TeacherDashboard from "../pages/teacher/dashboard";
import NotFound from "../pages/NotFound";
import StudentsFeedback from "../pages/teacher/students-feedback";
import ScheduledLessons from "../pages/teacher/scheduled-lessons";
import ManageLessons from "../pages/teacher/manage-lessons";
import ManageSchedule from "../pages/teacher/manage-schedule";
import Messages from "../pages/student-parent/messages";
import Progress from "../pages/teacher/progress";
import ProfileAccountSettings from "../pages/teacher/profile-settings";
import Earnings from "../pages/teacher/earnings";
import BillingDashboard from "../pages/billing/BillingDashboard";

import ManageCourses from "../pages/teacher/manage-courses";
import CreateCourse from "../pages/teacher/create-course";
import LessonsList from "../pages/teacher/lessons-list";
import NotificationsPage from "../pages/shared/notifications";

import ProtectedRoute from "../components/ProtectedRoute";
import { canManageCourses } from "../utils/authz";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<TeacherDashboard />} />
      <Route path="/students-feedback" element={<StudentsFeedback />} />
      <Route path="/scheduled-lessons" element={<ScheduledLessons />} />
      <Route path="/manage-lessons" element={<ManageLessons />} />
      <Route path="/manage-schedule" element={<ManageSchedule />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile-settings" element={<ProfileAccountSettings />} />
      <Route path="/billing" element={<BillingDashboard />} />
      <Route path="/earnings" element={<Earnings />} />

      {/* Course Management: ONLY independent teacher allowed under /teacher */}
      <Route
        element={
          <ProtectedRoute
            allow={canManageCourses}
            redirectTo="/teacher/dashboard"
          />
        }
      >
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/edit-course/:courseId" element={<CreateCourse />} />
        <Route path="/edit-lesson/:courseId" element={<CreateCourse />} />
        <Route path="/create-lesson/:courseId" element={<CreateCourse />} />
        <Route path="/lessons/:courseId" element={<LessonsList />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default TeacherRoutes;
