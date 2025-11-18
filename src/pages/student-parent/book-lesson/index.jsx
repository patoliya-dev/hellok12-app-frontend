import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
import { getRolePath } from "../../../utils/rolePath";
import {
  createPaymentIntent,
  createSetupIntent,
  fetchPaymentMethods
} from "../../../reducers/payments/paymentsThunks";
import { successToast, errorToast } from "../../../utils/utils";
import { getCourseDetails } from "../../../services/courses/course.service";
import { fetchCurrentUser } from "reducers/auth/authThunks";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  // ✅ Validate both path param and query param
  if (!["enroll", "trial"].includes(action)) {
    return <Navigate to="/404" replace />;
  }
  if (!id) {
    return <Navigate to="/404" replace />;
  }

  const currentUser = useSelector(selectAuthUser);
  const isStudent = currentUser?.role === "student";
  const isParent = currentUser?.role === "parent";

  const [type, setType] = useState(action);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(currentUser?.profile?.children?.[0] || null);
  const [address, setAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [courseData, setCourseData] = useState(classData)

  // NEW: read payment methods & parent students from payments slice
  const paymentMethods = useSelector((s) => s.payments?.methods || []);
  const steps = type === "trial" ? stepsForTrial : stepsForEntrollment;

  // Load parent's students and saved cards on mount (if parent)
  useEffect(() => {
    (async () => {
      if (isParent && currentUser?.id) {
        dispatch(fetchCurrentUser());
      }
      // always fetch saved cards
      dispatch(fetchPaymentMethods());
    })();
  }, [isParent, currentUser?.id, dispatch]);

  useEffect(() => {
    const fetchCourse = async () => {
      // setIsLoading(true);
      try {
        const { data } = await getCourseDetails(id);
        setCourseData(data);
      } catch (error) {
        errorToast(error.response?.data || error.message);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (isStudent) {
      setSelectedStudent(currentUser);
    }
  }, [isStudent, currentUser]);

  // Set default payment method when fetched
  useEffect(() => {
    if (paymentMethods?.length > 0) {
      const defaultCard = paymentMethods.find((c) => c?.isDefault) || paymentMethods[0];
      if (defaultCard) {
        setSelectedPaymentMethod({ type: "saved_card", data: defaultCard });
      }
    }
  }, [paymentMethods]);

  // Set default student when parent students loaded
  useEffect(() => {
    if (isParent && currentUser?.profile?.children?.length > 0) {
      // default to first student if none selected
      if (!selectedStudent) {
        setSelectedStudent(currentUser?.profile?.children[0]);
      }
    }
  }, [isParent, currentUser, selectedStudent]);

  const goBackOne = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(getRolePath(currentUser?.role || "student", "find-teacher"));
    }
  };

  const goBackTwo = () => {
    if (window.history.length > 2) {
      navigate(-2);
    } else {
      navigate(getRolePath(currentUser?.role || "student", "find-teacher"));
    }
  };

  const breadCrumbData = [
    {
      label: "Find Teachers",
      path: getRolePath(currentUser?.role || "student", "find-teacher"),
    },
    {
      label: "Teacher Details",
      onClick: goBackTwo,
    },
    {
      label: "Course Details",
      onClick: goBackOne,
    },
    { label: "Book Lessons", path: "#", current: true },
  ];

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
    return courseData?.price || 0;
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

  // New: use real createPaymentIntent thunk and confirm via stripe
  const handleSubmit = async () => {
    try {
      // ensure student selected
      if (!selectedStudent) return errorToast('Select a student');

      // generate idempotency key (uuid recommended)
      const idempotencyKey = `booking-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      // 1) Ensure Stripe customer exists for this user (server will create & return user)
      if (!currentUser?.stripeCustomerId) {
        try {
          await dispatch(createCustomer({})).unwrap();
        } catch (err) {
          // non-fatal: allow createPaymentIntent to trigger createCustomer on server too
          console.warn('createCustomer failed or already exists', err);
        }
      }

      // 2) Create booking on server BEFORE payment so bookingId is available
      const bookingPayload = {
        classId: courseData?.id,
        studentId: selectedStudent?.id,
        teacherId: courseData?.teacher?.id,
        // include amount so server knows payment expectations
        amount: Math.round((courseData?.price || 0) * 100),
      };
      const bookingRes = await dispatch(createBooking(bookingPayload)).unwrap();
      const bookingId = bookingRes?.booking?._id || bookingRes?.booking?.id || bookingRes?._id;

      // 3) Create PaymentIntent via thunk
      const paymentIntentRes = await dispatch(createPaymentIntent({
        bookingId: bookingId || null,
        amountCents: Math.round((courseData?.price || 0) * 100),
        currency: 'usd',
        paymentMethodId: selectedPaymentMethod?.type === 'saved_card' ? selectedPaymentMethod?.data?.stripePaymentMethodId || selectedPaymentMethod?.data?.id : undefined,
        savePaymentMethod: selectedPaymentMethod?.type !== 'saved_card', // if new, maybe save
        idempotencyKey,
        metadata: {
          classId: courseData?.id,
          studentId: selectedStudent?.id
        }
      })).unwrap();

      const clientSecret = paymentIntentRes?.data?.client_secret || paymentIntentRes?.client_secret || paymentIntentRes?.client_secret;
      if (!clientSecret) throw new Error('Missing client secret from createPaymentIntent');

      // 4) Confirm payment via Stripe
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) throw new Error('Stripe failed to load');

      let confirmResult;
      if (selectedPaymentMethod?.type === 'saved_card' && selectedPaymentMethod?.data?.stripePaymentMethodId) {
        confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: selectedPaymentMethod.data.stripePaymentMethodId || selectedPaymentMethod.data.id
        });
      } else {
        // No Elements in UI: call confirm without payment_method; server may respond with next action
        confirmResult = await stripe.confirmCardPayment(clientSecret);
      }

      if (confirmResult.error) {
        // Handle 3DS or other errors — show error toast
        throw confirmResult.error;
      }

      if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === 'succeeded') {
        successToast('Payment successful');
        setShowSuccessModal(true);
      } else {
        throw new Error('Payment not completed: ' + (confirmResult.paymentIntent?.status || 'unknown'));
      }
    } catch (err) {
      console.error('Payment error', err);
      errorToast(err?.message || 'Payment failed');
    }
  };

  // New: save card flow - call createSetupIntent thunk with card payload (UI currently collects raw card fields)
  const handleAddPaymentMethod = (cardData) => {
    (async () => {
      try {
        successToast("Saving payment method...");
        // createSetupIntent will call backend endpoint - payload may include card data
        const res = await dispatch(createSetupIntent(cardData)).unwrap();
        // backend shape may be { data: { paymentMethod: {...} } } or { paymentMethod: {...} }
        const pm = res?.data?.paymentMethod || res?.paymentMethod || res?.data;
        if (pm) {
          // refresh list
          await dispatch(fetchPaymentMethods());
          setSelectedPaymentMethod({ type: "saved_card", data: pm });
          successToast("Payment method saved");
        } else {
          // fallback: show success and refresh methods
          await dispatch(fetchPaymentMethods());
          successToast("Payment method saved");
        }
      } catch (err) {
        console.error("Failed to save payment method", err);
        // surface backend message when available
        const message = err?.payload?.message || err?.message || 'Failed to save payment method';
        errorToast(message);
      }
    })();
  };

  const onCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAddress("");
    setSelectedStudent(null);
    if (type === "enroll") {
      setCurrentStep(1);
      if (paymentMethods?.length > 0) {
        const defaultCard = paymentMethods.find((c) => c?.isDefault) || paymentMethods[0];
        setSelectedPaymentMethod({ type: "saved_card", data: defaultCard });
      }
    }
    navigate(getRolePath(currentUser?.role || "student", "dashboard"));
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

  // Below: pass dynamic parentStudents and paymentMethods (keeps UI markup unchanged)
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
                          students={currentUser?.profile?.children}
                          selectedStudent={selectedStudent}
                          onStudentSelect={handleStudentSelect}
                          address={address}
                          onAddressChange={handleAddressChange}
                        />
                      )}

                      <BookingSummary
                        courseData={courseData}
                        selectedStudent={selectedStudent}
                        total={calculateTotal()}
                      />
                    </div>

                    {/* Right Panel - Class Details */}
                    <div className="col-span-6">
                      <div className="sticky top-24">
                        <ClassDetails courseData={courseData} />
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
                  <ClassDetails courseData={courseData} />

                  {isParent && (
                    <StudentSelector
                      students={currentUser?.profile?.children}
                      selectedStudent={selectedStudent}
                      onStudentSelect={handleStudentSelect}
                      address={address}
                      onAddressChange={handleAddressChange}
                    />
                  )}

                  <BookingSummary
                    courseData={courseData}
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
                          savedCards={paymentMethods}
                          onPaymentMethodSelect={handlePaymentMethodSelect}
                          selectedMethod={selectedPaymentMethod}
                          onAddPaymentMethod={handleAddPaymentMethod}
                        />
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="col-span-6 space-y-6">
                        <BookingConfirmation
                          courseData={courseData}
                          selectedPaymentMethod={selectedPaymentMethod}
                          teacherData={courseData?.teacher}
                          selectedStudent={selectedStudent}
                        />
                      </div>
                    )}
                    <div className="col-span-6">
                      <div className="sticky top-24">
                        <BookingSummary
                          courseData={courseData}
                          selectedStudent={selectedStudent}
                          total={calculateTotal()}
                        />
                        <div
                          className={`mt-6 flex justify-end ${currentStep === 3 && "gap-10"
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
                            className={`h-12 ${currentStep === 3 ? "w-72" : "w-56"
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
                      savedCards={paymentMethods}
                      onPaymentMethodSelect={handlePaymentMethodSelect}
                      selectedMethod={selectedPaymentMethod}
                      onAddPaymentMethod={handleAddPaymentMethod}
                    />
                  )}
                  {currentStep === 3 && (
                    <BookingConfirmation
                      courseData={courseData}
                      selectedPaymentMethod={selectedPaymentMethod}
                      teacherData={courseData?.teacher}
                      selectedStudent={selectedStudent}
                    />
                  )}
                  <BookingSummary
                    courseData={courseData}
                    selectedStudent={selectedStudent}
                    total={calculateTotal()}
                  />
                  <div className="sticky bottom-4">
                    <div
                      className={`mt-6 flex ${currentStep === 3
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
                        className={`h-12 ${currentStep === 3 ? "w-72" : "w-56"
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
                          students={currentUser?.profile?.children}
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
                        <ClassDetails courseData={courseData} type="trial" />
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
                  <ClassDetails courseData={courseData} type="trial" />

                  {isParent && (
                    <StudentSelector
                      students={currentUser?.profile?.children}
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
                        courseData={courseData}
                        selectedPaymentMethod={selectedPaymentMethod}
                        teacherData={courseData?.teacher}
                        selectedStudent={selectedStudent}
                        type="trial"
                      />
                    </div>
                    <div className="col-span-6">
                      <div className="sticky top-24">
                        <ClassDetails courseData={courseData} type="trial" />
                        <div
                          className={`mt-6 flex justify-end ${currentStep === 2 && "gap-10"
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
                            className={`h-12 ${currentStep === 2 ? "w-72" : "w-56"
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
                    courseData={courseData}
                    selectedPaymentMethod={selectedPaymentMethod}
                    teacherData={courseData?.teacher}
                    selectedStudent={selectedStudent}
                    type="trial"
                  />
                  <ClassDetails courseData={courseData} type="trial" />
                  <div className="sticky bottom-4">
                    <div
                      className={`mt-6 flex ${currentStep === 2
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
                        className={`h-12 ${currentStep === 2 ? "w-72" : "w-56"
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
