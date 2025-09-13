import { useState } from "react";
import { useSelector } from "react-redux";
import RoleBasedHeader from "../../components/ui/RoleBasedHeader";
import CommonStepper from "./components/CommonStepper";
import Breadcrumb from "../../components/ui/Breadcrumb";
import StudentSelector from "./components/StudentSelector";
import ClassDetails from "./components/ClassDetails";
import BookingSummary from "./components/BookingSummary";
import Button from "../../components/ui/Button";

const StepperStep = [
  {
    id: 1,
    title: "Student Info",
  },
  {
    id: 2,
    title: "Payment",
  },
  {
    id: 3,
    title: "Confirm",
  },
];

const breadCrumbData = [
  { label: "Find Teachers", path: "#" },
  { label: "Teacher Details", path: "#" },
  { label: "Book Lessons", path: "#", current: true },
];

const mockStudents = [
  {
    id: "student-001",
    name: "Emma Johnson",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
    age: 12,
  },
  {
    id: "student-002",
    name: "Alex Johnson",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    age: 15,
  },
];

// Mock data - In real app, this would come from props/context/API
const classData = {
  id: "class-001",
  title: "Conversational English Mastery",
  description:
    "Improve your speaking confidence through engaging conversations about daily topics, current events, and personal interests. Perfect for intermediate to advanced learners.",
  type: "1-on-1", // or "Group"
  duration: 60,
  price: 45,
  teacher: {
    id: "teacher-001",
    name: "Sarah Martinez",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    timezone: "America/New_York",
    school: "Adrian High School",
  },
  // For group classes
  maxStudents: 8,
  enrolledStudents: 6,
  location: "Downtown Learning Center, Room 204",
  groupSchedule: {
    days: ["Monday", "Wednesday", "Friday"],
    time: "6:00 PM - 7:15 PM",
    nextSession: "Monday, January 8th at 6:00 PM",
  },
};

const BookLesson = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [location, setLocation] = useState("");

  const currentUser = useSelector((state) => state.auth.user);

  const handleNextStep = () => {
    if (currentStep < StepperStep.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const calculateTotal = () => {
    return classData?.price || 0;
  };

  const isFormValid = () => {
    const hasSelectedStudent = selectedStudent !== null;
    return !!hasSelectedStudent;
  };

  const getButtonText = () => {
    if (currentStep === 1) return "Next";
    else if (currentStep === 2) return "Review Booking";
    else return `Confirm & Pay $${calculateTotal()}`;
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-12 gap-8">
                {/* Left Panel - Booking Form */}
                <div className="col-span-6 space-y-6">
                  <StudentSelector
                    students={mockStudents}
                    selectedStudent={selectedStudent}
                    onStudentSelect={handleStudentSelect}
                    location={location}
                    onLocationChange={handleLocationChange}
                  />

                  <BookingSummary
                    classData={classData}
                    selectedStudent={selectedStudent}
                    total={calculateTotal()}
                  />
                </div>

                {/* Right Panel - Class Details */}
                <div className="col-span-6">
                  <div className="sticky top-24">
                    <ClassDetails classData={classData} />
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleNextStep}
                        disabled={!isFormValid()}
                        className="w-56 h-12"
                        size="lg"
                        iconName="ChevronRight"
                        iconPosition="right"
                        iconSize={16}
                      >
                        {getButtonText()}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile View */}
            <div className="lg:hidden space-y-6">
              <ClassDetails classData={classData} />

              <StudentSelector
                students={mockStudents}
                selectedStudent={selectedStudent}
                onStudentSelect={handleStudentSelect}
                location={location}
                onLocationChange={handleLocationChange}
              />

              <BookingSummary
                classData={classData}
                selectedStudent={selectedStudent}
                total={calculateTotal()}
              />

              <div className="sticky bottom-4">
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleNextStep}
                    disabled={!isFormValid()}
                    className="w-56 h-12"
                    size="lg"
                    iconName="ChevronRight"
                    iconPosition="right"
                    iconSize={16}
                  >
                    {getButtonText()}
                  </Button>
                </div>
              </div>
            </div>
          </>
        );
      case 2:
      case 3:
        return (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Panel - Booking Form */}
            <div className="col-span-6 space-y-6">
              <h1>In progress</h1>
            </div>
            <div className="col-span-6">
              <div className="sticky top-24">
                <BookingSummary
                  classData={classData}
                  selectedStudent={selectedStudent}
                  total={calculateTotal()}
                />
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    disabled={!isFormValid()}
                    className="w-56 h-12"
                    size="lg"
                    iconName="ChevronRight"
                    iconPosition="right"
                    iconSize={16}
                  >
                    {getButtonText()}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <Breadcrumb customPath={breadCrumbData} className="mt-8" />
        <section>
          <h1 className="text-foreground font-bold text-h3 mb-2">
            Book Your Lessons
          </h1>
          <p className="text-muted-foreground text-body2 xl:text-[16px]">
            Complete your booking in a few simple steps. All fields marked with
            * are required.
          </p>
        </section>
        <CommonStepper stepperContent={StepperStep} currentStep={currentStep} />
        {getCurrentStepComponent()}
      </main>
    </div>
  );
};

export default BookLesson;
