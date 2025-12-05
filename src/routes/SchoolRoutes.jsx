import { Routes, Route } from "react-router-dom";
// import SchoolDashboard from "../pages/school/dashboard";
import NotFound from "../pages/NotFound";
import UpcomingLessons from "../pages/school/upcoming-lessons";
import ScheduledLessons from "../pages/school/scheduled-lessons";
import ManageTeachers from "../pages/school/manage-teachers";
import SchoolDashboard from "../pages/school/dashboard";
import ManageStudents from "../pages/school/manage-students";
import Earnings from "../pages/school/earnings";
import ManageCourses from "../pages/school/manage-courses";
import CreateCourse from "../pages/school/create-course";
import ProfileAccountSettings from "../pages/school/profile-settings";

const SchoolRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<SchoolDashboard />} />
      <Route path="/upcoming-lessons" element={<UpcomingLessons />} />
      <Route path="/scheduled-lessons" element={<ScheduledLessons />} />
      <Route path="/manage-teachers" element={<ManageTeachers />} />
      <Route path="/manage-students" element={<ManageStudents />} />
      <Route path="/manage-courses" element={<ManageCourses />} />
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/edit-course/:courseId" element={<CreateCourse />} />
      <Route path="/edit-lesson/:courseId" element={<CreateCourse />} />
      <Route path="/create-lesson/:courseId" element={<CreateCourse />} />
      {/* <Route path="/lessons/:courseId" element={<LessonsList />} /> */}
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/profile-settings" element={<ProfileAccountSettings />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SchoolRoutes;
