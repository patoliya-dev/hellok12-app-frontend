import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import BookingSteps from "./components/BookingSteps";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import StudentSelector from "./components/StudentSelector";
import ClassDetails from "./components/ClassDetails";
import BookingSummary from "./components/BookingSummary";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import BookingConfirmation from "./components/BookingConfirmation";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { copyToClipboard } from "../../../utils/utils";

// Steps for enrollment
const stepsForEntrollment = [
  { id: 1, title: "Student Info", icon: "User" },
  { id: 2, title: "Payment", icon: "CreditCard" },
  { id: 3, title: "Confirm", icon: "CheckCircle" },
];

// Steps for trial
const stepsForTrial = [
  { id: 1, title: "Student Info", icon: "User" },
  { id: 2, title: "Confirm", icon: "CheckCircle" },
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
    email: "fake_email1@example.com",
    phone: "1234567890",
  },
  {
    id: "student-002",
    name: "Alex Johnson",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    age: 15,
    email: "fake_email2@example.com",
    phone: "1234567890",
  },
];

// Mock data - In real app, this would come from props/context/API
const classData = {
  id: "class-001",
  title: "Conversational English Mastery",
  description:
    "Improve your speaking confidence through engaging conversations about daily topics, current events, and personal interests. Perfect for intermediate to advanced learners.",
  type: "1-on-1", // or "Group"
  courseType: "Online Course",
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

// Mock data for saved payment methods
const savedCards = [
  {
    id: "card_1",
    last4: "4242",
    brand: "Visa",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: "card_2",
    last4: "5555",
    brand: "Mastercard",
    expiry: "08/27",
    isDefault: false,
  },
];

const BookLesson = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // enroll && trial
  const action = searchParams.get("action");

  // ✅ Validate both path param and query param
  if (!["enroll", "trial"].includes(action)) {
    return <Navigate to="/404" replace />;
  }

  const currentUser = useSelector(selectAuthUser);
  const isStudent = currentUser?.role === "student";
  const isParent = currentUser?.role === "parent";

  const [type, setType] = useState(action);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [address, setAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = type === "trial" ? stepsForTrial : stepsForEntrollment;

  useEffect(() => {
    if (isStudent) {
      setSelectedStudent(currentUser);
    }
  });

  useEffect(() => {
    // Set default payment method
    if (savedCards?.length > 0) {
      const defaultCard =
        savedCards?.find((card) => card?.isDefault) || savedCards?.[0];
      setSelectedPaymentMethod({ type: "saved_card", data: defaultCard });
    }
  }, []);

  const handleNextStep = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
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

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  const handleAddPaymentMethod = (data) => {
    const updateData = {
      id: `card_${savedCards?.length + 1}`,
      last4: data?.cardNumber?.slice(-4),
      brand: "Card",
      expiry: data?.expiryDate,
      isDefault: false,
    };
    savedCards.push(updateData);
    setSelectedPaymentMethod({ type: "new_card", data: updateData });
  };

  const onCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAddress("");
    setSelectedStudent(null);
    if (type === "enroll") {
      setCurrentStep(1);
      const defaultCard =
        savedCards?.find((card) => card?.isDefault) || savedCards?.[0];
      setSelectedPaymentMethod({ type: "saved_card", data: defaultCard });
    }
    navigate(`/student-parent/dashboard`);
  };

  const getButtonText = () => {
    const texts = {
      enroll: {
        1: "Next",
        2: "Review Booking",
        default: `Confirm & Pay $${calculateTotal()}`,
      },
      trial: {
        1: "Next",
        default: "Confirm",
      },
    };

    return texts[type]?.[currentStep] ?? texts[type]?.default ?? "Next";
  };

  const getCurrentStepComponent = () => {
    switch (type) {
      case "enroll":
        switch (currentStep) {
          case 1:
            return (
              <>
                {/* Desktop View */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-12 gap-8">
                    {/* Left Panel - Booking Form */}
                    <div className="col-span-6 space-y-6">
                      {isParent && (
                        <StudentSelector
                          students={mockStudents}
                          selectedStudent={selectedStudent}
                          onStudentSelect={handleStudentSelect}
                          address={address}
                          onAddressChange={handleAddressChange}
                        />
                      )}

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

                  {isParent && (
                    <StudentSelector
                      students={mockStudents}
                      selectedStudent={selectedStudent}
                      onStudentSelect={handleStudentSelect}
                      address={address}
                      onAddressChange={handleAddressChange}
                    />
                  )}

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
              <>
                {/* Desktop View */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-12 gap-8">
                    {/* Left Panel - Booking Form */}
                    {currentStep === 2 && (
                      <div className="col-span-6 space-y-6">
                        <PaymentMethodSelector
                          savedCards={savedCards}
                          onPaymentMethodSelect={handlePaymentMethodSelect}
                          selectedMethod={selectedPaymentMethod}
                          onAddPaymentMethod={handleAddPaymentMethod}
                        />
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="col-span-6 space-y-6">
                        <BookingConfirmation
                          classData={classData}
                          selectedPaymentMethod={selectedPaymentMethod}
                          teacherData={classData?.teacher}
                          selectedStudent={selectedStudent}
                        />
                      </div>
                    )}
                    <div className="col-span-6">
                      <div className="sticky top-24">
                        <BookingSummary
                          classData={classData}
                          selectedStudent={selectedStudent}
                          total={calculateTotal()}
                        />
                        <div
                          className={`mt-6 flex justify-end ${
                            currentStep === 3 && "gap-10"
                          }`}
                        >
                          {currentStep === 3 && (
                            <Button
                              variant="ghost"
                              size="lg"
                              className="h-12"
                              onClick={() => setCurrentStep(2)}
                            >
                              Back to Edit
                            </Button>
                          )}
                          <Button
                            onClick={
                              currentStep === 3 ? handleSubmit : handleNextStep
                            }
                            disabled={selectedPaymentMethod === null}
                            className={`h-12 ${
                              currentStep === 3 ? "w-72" : "w-56"
                            }`}
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
                  {currentStep === 2 && (
                    <PaymentMethodSelector
                      savedCards={savedCards}
                      onPaymentMethodSelect={handlePaymentMethodSelect}
                      selectedMethod={selectedPaymentMethod}
                      onAddPaymentMethod={handleAddPaymentMethod}
                    />
                  )}
                  {currentStep === 3 && (
                    <BookingConfirmation
                      classData={classData}
                      selectedPaymentMethod={selectedPaymentMethod}
                      teacherData={classData?.teacher}
                      selectedStudent={selectedStudent}
                    />
                  )}
                  <BookingSummary
                    classData={classData}
                    selectedStudent={selectedStudent}
                    total={calculateTotal()}
                  />
                  <div className="sticky bottom-4">
                    <div
                      className={`mt-6 flex ${
                        currentStep === 3
                          ? "flex-col items-center gap-4"
                          : "justify-center"
                      }`}
                    >
                      {currentStep === 3 && (
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12"
                          onClick={() => setCurrentStep(2)}
                        >
                          Back to Edit
                        </Button>
                      )}
                      <Button
                        onClick={
                          currentStep === 3 ? handleSubmit : handleNextStep
                        }
                        disabled={selectedPaymentMethod === null}
                        className={`h-12 ${
                          currentStep === 3 ? "w-72" : "w-56"
                        }`}
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
        }
        break;
      case "trial":
        switch (currentStep) {
          case 1:
            return (
              <>
                {/* Desktop View */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-12 gap-8">
                    {/* Left Panel - Booking Form */}
                    {isParent && (
                      <div className="col-span-6 space-y-6">
                        <StudentSelector
                          students={mockStudents}
                          selectedStudent={selectedStudent}
                          onStudentSelect={handleStudentSelect}
                          address={address}
                          onAddressChange={handleAddressChange}
                        />
                      </div>
                    )}

                    {/* Right Panel - Class Details */}
                    <div className="col-span-6">
                      <div className="sticky top-24">
                        <ClassDetails classData={classData} type="trial" />
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
                  <ClassDetails classData={classData} type="trial" />

                  {isParent && (
                    <StudentSelector
                      students={mockStudents}
                      selectedStudent={selectedStudent}
                      onStudentSelect={handleStudentSelect}
                      address={address}
                      onAddressChange={handleAddressChange}
                    />
                  )}

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
            return (
              <>
                {/* Desktop View */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6 space-y-6">
                      <BookingConfirmation
                        classData={classData}
                        selectedPaymentMethod={selectedPaymentMethod}
                        teacherData={classData?.teacher}
                        selectedStudent={selectedStudent}
                        type="trial"
                      />
                    </div>
                    <div className="col-span-6">
                      <div className="sticky top-24">
                        <ClassDetails classData={classData} type="trial" />
                        <div
                          className={`mt-6 flex justify-end ${
                            currentStep === 2 && "gap-10"
                          }`}
                        >
                          {currentStep === 2 && (
                            <Button
                              variant="ghost"
                              size="lg"
                              className="h-12"
                              onClick={() => setCurrentStep(1)}
                            >
                              Back to Edit
                            </Button>
                          )}
                          <Button
                            onClick={
                              currentStep === 2 ? handleSubmit : handleNextStep
                            }
                            disabled={selectedPaymentMethod === null}
                            className={`h-12 ${
                              currentStep === 2 ? "w-72" : "w-56"
                            }`}
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
                  <BookingConfirmation
                    classData={classData}
                    selectedPaymentMethod={selectedPaymentMethod}
                    teacherData={classData?.teacher}
                    selectedStudent={selectedStudent}
                    type="trial"
                  />
                  <ClassDetails classData={classData} type="trial" />
                  <div className="sticky bottom-4">
                    <div
                      className={`mt-6 flex ${
                        currentStep === 2
                          ? "flex-col items-center gap-4"
                          : "justify-center"
                      }`}
                    >
                      {currentStep === 2 && (
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12"
                          onClick={() => setCurrentStep(1)}
                        >
                          Back to Edit
                        </Button>
                      )}
                      <Button
                        onClick={
                          currentStep === 2 ? handleSubmit : handleNextStep
                        }
                        disabled={selectedPaymentMethod === null}
                        className={`h-12 ${
                          currentStep === 2 ? "w-72" : "w-56"
                        }`}
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
        }
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
        {/* Booking Steps */}
        <BookingSteps
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          type={type}
        />

        {getCurrentStepComponent()}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-card rounded-lg max-w-lg w-full text-center shadow-elevation-3 p-4">
            <div className="flex justify-end">
              <Icon
                name={"X"}
                size={30}
                className="text-brand-gray-800 hover:cursor-pointer"
                onClick={onCloseSuccessModal}
              />
            </div>
            <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Check" size={64} color="white" />
            </div>
            <h3 className="text-h4 font-bold text-foreground mb-4">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-brand-gray-800 mb-4 leading-relaxed md:px-10">
              {type === "enroll"
                ? "Our lesson has been successfully booked. You'll receive a confirmation email shortly with lesson details and joining instructions"
                : "Our trial lesson has been successfully booked. You'll receive a confirmation email shortly with lesson details and joining instructions"}{" "}
            </p>
            {type === "enroll" ? (
              <div className="border border-[#E5E7EB] rounded-md py-5 px-8">
                <p className="mb-2 leading-relaxed">
                  Refer & get 20% off on your next lesson for each new course
                  signup
                </p>
                <div className="bg-blue-50 border-2 border-primary rounded-lg p-3 cursor-pointer">
                  <p
                    className="text-sm text-blue-800"
                    onClick={() =>
                      copyToClipboard("https://www.temporary-url.com/C5E602")
                    }
                  >
                    https://www.temporary-url.com/C5E602
                  </p>
                </div>
              </div>
            ) : (
              <Button
                size="xl"
                onClick={() => navigate(`/student-parent/dashboard`)}
                className="mb-6"
              >
                Start learning
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookLesson;
