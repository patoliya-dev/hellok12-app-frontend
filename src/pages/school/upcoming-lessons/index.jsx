import { useState } from "react";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { breadCrumbData, courseOption } from "./data";
import Select from "components/ui/Select";
import DateRangePicker from "components/ui/DateRangePicker";
import Lessons from "./components/Lessons";
import { mockLessons } from "../dashboard/data";

const UpcomingLessons = () => {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  const handleDateChange = (values) => {
    setDates(values);
  };

  const filteredLessons = mockLessons.filter((lesson) => {
    if (selectedCourse === "all") {
      return true;
    }
    return lesson.courseId === selectedCourse;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <Breadcrumb customPath={breadCrumbData} />
        </section>
        <section className="my-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <Select
            label="Select Course"
            options={courseOption}
            value={selectedCourse}
            onChange={(value) => setSelectedCourse(value)}
            className="md:w-96 lg:w-128"
          />
          <DateRangePicker onChange={handleDateChange} />
        </section>
        <section className="mb-8">
          <Lessons upcomingLessons={filteredLessons} />
        </section>
      </main>
    </div>
  );
};

export default UpcomingLessons;
