import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
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
import { successToast, errorToast } from "../../../utils/utils";
import { fetchCurrentUser } from "reducers/auth/authThunks";
import {
  createPaymentIntent,
  fetchPaymentMethods,
  createCustomer,
} from "../../../reducers/payments/paymentsThunks";
import { getCourseDetails } from "../../../services/courses/course.service";
import { createBooking } from "reducers/bookings/bookingsThunks";
import { selectSelectedTeacher } from "reducers/teachers/teachersSlice";

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

const BookLesson = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  // grab lessonId query param (may be present for trial flow)
  const lessonIdParam = searchParams.get("lessonId") || null;

  // Validate action
  if (!["enroll", "trial"].includes(action)) {
    return <Navigate to="/404" replace />;
  }
  if (!id) {
    return <Navigate to="/404" replace />;
  }

  const currentUser = useSelector(selectAuthUser);
  const selectedTeacher = useSelector(selectSelectedTeacher);
  const isStudent = currentUser?.role === "student";
  const isParent = currentUser?.role === "parent";

  const [type, setType] = useState(action);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(
    currentUser?.profile?.children?.[0] || null,
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const isSubmitting = submitLoading;

  /**
   * IMPORTANT:
   * address come as:
   *  - structured object
   */
  const [address, setAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [courseData, setCourseData] = useState({}); // initially empty
  const stripePromise = loadStripe(
    import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
  );

  // NEW: read payment methods & parent students from payments slice
  const paymentMethods = useSelector((s) => s.payments?.methods || []);
  const steps = type === "trial" ? stepsForTrial : stepsForEntrollment;

  const isInPersonOneOnOne = useMemo(() => {
    return (
      courseData?.mode === "in-person" && courseData?.lessonType === "1-on-1"
    );
  }, [courseData?.mode, courseData?.lessonType]);

  const parentChildren = useMemo(() => {
    return currentUser?.profile?.children || [];
  }, [currentUser]);

  const isSelectedStudentValidForParent = useMemo(() => {
    if (!isParent) return true;
    const sid = selectedStudent?._id || selectedStudent?.id;
    if (!sid) return false;
    return parentChildren.some((c) => (c?._id || c?.id) === sid);
  }, [isParent, selectedStudent, parentChildren]);

  const isAlreadyPurchasedForSelectedStudent =
    !!courseData?.purchaseInfo?.alreadyPurchased;
  const hasNoRemainingLessons =
    type === "enroll" &&
    Number(courseData?.pricing?.remainingLessons || 0) <= 0 &&
    Number(courseData?.pricing?.totalLessons || 0) > 0;
  const isBookingBlocked =
    isAlreadyPurchasedForSelectedStudent || hasNoRemainingLessons;

  // Normalize address into backend expected structure
  const normalizedAddress = useMemo(() => {
    if (!isInPersonOneOnOne) return undefined;

    if (!address) return undefined;

    // If StudentSelector sends string, convert -> { line1: string }
    if (typeof address === "string") {
      const line1 = address.trim();
      return line1 ? { line1 } : undefined;
    }

    // If it sends object
    if (typeof address === "object") {
      const line1 = String(address?.line1 || "").trim();
      if (!line1) return undefined;

      return {
        line1,
        line2: address?.line2 || "",
        city: address?.city || "",
        state: address?.state || "",
        postalCode: address?.postalCode || "",
        country: address?.country || "",
      };
    }

    return undefined;
  }, [address, isInPersonOneOnOne]);

  const validateStep = () => {
    // Student validation
    if (!selectedStudent || !(selectedStudent?._id || selectedStudent?.id)) {
      return {
        ok: false,
        message: "Please select a student before continuing.",
      };
    }

    // Parent must pick valid child
    if (isParent && !isSelectedStudentValidForParent) {
      return {
        ok: false,
        message: "Please select a valid child from your account.",
      };
    }

    // Address validation (in-person 1-on-1 only)
    if (isInPersonOneOnOne) {
      if (!normalizedAddress?.line1) {
        return {
          ok: false,
          message: "Address is required for in-person 1-on-1 booking.",
        };
      }
      // Optional: enforce minimum quality
      if (String(normalizedAddress.line1).trim().length < 5) {
        return {
          ok: false,
          message: "Please enter a more complete address (building/street).",
        };
      }
    }

    return { ok: true };
  };

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
      try {
        const studentId =
          (selectedStudent?._id || selectedStudent?.id || "").toString() || "";
        const params = studentId ? { studentId } : {};
        const { data } = await getCourseDetails(id, params);
        setCourseData(data);
      } catch (error) {
        errorToast(error.response?.data || error.message);
      }
    };
    fetchCourse();
  }, [id, selectedStudent?._id, selectedStudent?.id]);

  // make sure selectedStudent has _id (if currentUser is a student)
  useEffect(() => {
    if (isStudent && currentUser) {
      if (typeof currentUser?._id === "undefined" && currentUser?.id) {
        setSelectedStudent({ ...currentUser, _id: currentUser.id });
      } else {
        setSelectedStudent(currentUser);
      }
    }
  }, [isStudent, currentUser]);

  // Set default payment method when fetched
  useEffect(() => {
    if (paymentMethods?.length > 0) {
      const defaultCard =
        paymentMethods.find((c) => c?.isDefault) || paymentMethods[0];
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
    if (isBookingBlocked) return;
    // Validate Step 1 only
    if (currentStep === 1) {
      const v = validateStep();
      if (!v.ok) return errorToast(v.message);
    }

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
    return (courseData?.pricing?.effectivePrice ?? courseData?.price) || 0;
  };

  // Used only for Step 1 "Next" button
  const isFormValid = () => {
    const v = validateStep();
    return !!v.ok;
  };

  const handleAddressChange = (value) => {
    setAddress(value);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const mapBackendErrorToMessage = (err) => {
    const code =
      err?.code || err?.statusCode || err?.error?.code || err?.data?.code;
    switch (code) {
      case "COURSE_FULL":
        return "This course is full. Please choose another or contact support.";
      case "TRIAL_CAPACITY_EXHAUSTED":
        return "Trial capacity for this lesson is exhausted.";
      case "ALREADY_TAKEN_TRIAL":
        return "Selected student has already used a trial for this course.";
      case "STUDENT_REQUIRED":
      case "INVALID_STUDENT":
        return "Please select a valid student.";
      case "ADDRESS_REQUIRED":
        return "Address is required for in-person 1-on-1 bookings.";
      case "ALREADY_PURCHASED":
        return "This course is already purchased for the selected student.";
      case "NO_REMAINING_LESSONS":
        return "No remaining lessons are available for this course.";
      default:
        return err?.message || "Something went wrong. Please try again.";
    }
  };

  // New: use real createPaymentIntent thunk and confirm via stripe
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      // Validate again before submit (critical)
      const v = validateStep();
      if (!v.ok) return errorToast(v.message);
      if (isBookingBlocked) {
        return errorToast(
          isAlreadyPurchasedForSelectedStudent
            ? "This course is already purchased for the selected student."
            : "No remaining lessons are available for this course.",
        );
      }

      // generate idempotency key
      const idempotencyKey = `booking-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      // Ensure Stripe customer exists
      if (!currentUser?.stripeCustomerId) {
        try {
          await dispatch(createCustomer({})).unwrap();
        } catch (err) {
          console.warn("createCustomer failed (non-fatal)", err);
        }
      }

      // 2) Create booking on server BEFORE payment so bookingId is available
      const bookingPayload = {
        courseId: courseData?._id || courseData?.id,
        studentId: selectedStudent?._id || selectedStudent?.id,
        teacherId: selectedTeacher?._id || selectedTeacher?.id,
        amount:
          courseData?.pricing?.effectivePriceCents ??
          Math.round((courseData?.price || 0) * 100),
        isTrial: type === "trial",
        lessonId:
          type === "trial"
            ? lessonIdParam || courseData?.lessons?.[0]?._id
            : undefined,
        address: isInPersonOneOnOne ? normalizedAddress : undefined,
      };

      let bookingRes;
      try {
        bookingRes = await dispatch(createBooking(bookingPayload)).unwrap();
        bookingRes = bookingRes?.data;
      } catch (err) {
        const message = mapBackendErrorToMessage(err);
        return errorToast(message);
      }

      // If this is a trial booking and payment not required, bookingRes.booking already created and may be PAID
      if (bookingRes?.booking?.isTrial) {
        successToast("Trial booked successfully");
        setShowSuccessModal(true);
        return;
      }

      // 3) Create PaymentIntent
      const payoutReceiverType = selectedTeacher?.school ? "school" : "teacher";
      const payoutReceiverId = selectedTeacher?.school
        ? selectedTeacher.school
        : selectedTeacher?._id || selectedTeacher?.id;

      const piPayload = {
        bookingId: bookingRes?.booking?._id,
        teacherId: selectedTeacher?._id || selectedTeacher?.id,
        amount:
          bookingRes?.pricing?.effectiveAmountCents ??
          courseData?.pricing?.effectivePriceCents ??
          Math.round((courseData?.price || 0) * 100),
        currency: "usd",
        paymentMethodId:
          selectedPaymentMethod?.type === "saved_card"
            ? selectedPaymentMethod?.data?.stripePaymentMethodId ||
              selectedPaymentMethod?.data?.id
            : undefined,
        savePaymentMethod: selectedPaymentMethod?.type !== "saved_card",
        idempotencyKey,
        payoutReceiverType,
        payoutReceiverId,
        metadata: {
          courseId: courseData?._id || courseData?.id,
          studentId: selectedStudent?._id || selectedStudent?.id,
          lessonId:
            type === "trial"
              ? lessonIdParam || courseData?.lessons?.[0]?._id
              : undefined,
          bookingId: bookingRes?.booking?._id,
          payoutReceiverType,
          payoutReceiverId,
        },
      };

      const paymentIntentRes = await dispatch(
        createPaymentIntent(piPayload),
      ).unwrap();
      const clientSecret =
        paymentIntentRes?.client_secret || paymentIntentRes?.raw?.client_secret;
      if (!clientSecret) throw new Error("Missing client secret from server");

      // 4) Confirm via Stripe (if using saved PM provide it)
      const stripe = await loadStripe(
        import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
      );
      if (!stripe) throw new Error("Stripe failed to load");

      let confirmResult;
      if (
        selectedPaymentMethod?.type === "saved_card" &&
        (selectedPaymentMethod?.data?.stripePaymentMethodId ||
          selectedPaymentMethod?.data?.id)
      ) {
        confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method:
            selectedPaymentMethod.data.stripePaymentMethodId ||
            selectedPaymentMethod.data.id,
        });
      } else {
        confirmResult = await stripe.confirmCardPayment(clientSecret);
      }

      if (confirmResult.error) {
        throw confirmResult.error;
      }

      const pi = confirmResult.paymentIntent;
      if (
        pi &&
        (pi.status === "succeeded" ||
          pi.status === "processing" ||
          pi.status === "requires_capture")
      ) {
        successToast(
          "Payment initiated — confirmation will be finalised shortly.",
        );
        setShowSuccessModal(true);
      } else {
        throw new Error("Payment not completed: " + (pi?.status || "unknown"));
      }
    } catch (err) {
      console.error("Payment error", err);
      const msg = err?.message || "Payment failed. Please try again.";
      errorToast(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  // PaymentMethodSelector will confirm SetupIntent and return { paymentMethodId, pm } on success.
  const handleAddPaymentMethod = async (result = {}) => {
    try {
      const { paymentMethodId, pm } = result;
      // Refresh saved methods
      await dispatch(fetchPaymentMethods()).unwrap();

      let newCard = null;
      try {
        const methods = paymentMethods || [];
        newCard =
          methods.find(
            (m) =>
              m?.stripePaymentMethodId === paymentMethodId ||
              m?.id === paymentMethodId,
          ) || null;
      } catch (e) {
        newCard = null;
      }

      if (pm) {
        setSelectedPaymentMethod({ type: "saved_card", data: pm });
      } else if (newCard) {
        setSelectedPaymentMethod({ type: "saved_card", data: newCard });
      } else if (paymentMethodId) {
        setSelectedPaymentMethod({
          type: "saved_card",
          data: {
            id: paymentMethodId,
            stripePaymentMethodId: paymentMethodId,
            last4: "****",
          },
        });
      }
    } catch (err) {
      console.error("Failed to process added payment method", err);
      errorToast(err?.message || "Failed to save payment method");
    }
  };

  const onCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAddress(null);

    // keep student selection stable for parent; only reset for student flow if you want
    if (isStudent) setSelectedStudent(null);

    if (type === "enroll") {
      setCurrentStep(1);
      if (paymentMethods?.length > 0) {
        const defaultCard =
          paymentMethods.find((c) => c?.isDefault) || paymentMethods[0];
        setSelectedPaymentMethod({ type: "saved_card", data: defaultCard });
      }
    }
    navigate(getRolePath(currentUser?.role || "student", "dashboard"));
  };

  const getButtonText = () => {
    if (isAlreadyPurchasedForSelectedStudent) return "Already Purchased";
    if (hasNoRemainingLessons) return "No Remaining Lessons";

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
                          course={courseData}
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
                        <ClassDetails
                          courseData={courseData}
                          address={address}
                        />
                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={handleNextStep}
                            disabled={!isFormValid() || isBookingBlocked}
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
                  <ClassDetails courseData={courseData} address={address} />

                  {isParent && (
                    <StudentSelector
                      course={courseData}
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
                        disabled={!isFormValid() || isBookingBlocked}
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
                        <Elements stripe={stripePromise}>
                          <PaymentMethodSelector
                            savedCards={paymentMethods}
                            onPaymentMethodSelect={handlePaymentMethodSelect}
                            selectedMethod={selectedPaymentMethod}
                            onAddPaymentMethod={handleAddPaymentMethod}
                          />
                        </Elements>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="col-span-6 space-y-6">
                        <BookingConfirmation
                          courseData={courseData}
                          selectedPaymentMethod={selectedPaymentMethod}
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
                            disabled={
                              selectedPaymentMethod === null ||
                              isSubmitting ||
                              isBookingBlocked
                            }
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
                    <Elements stripe={stripePromise}>
                      <PaymentMethodSelector
                        savedCards={paymentMethods}
                        onPaymentMethodSelect={handlePaymentMethodSelect}
                        selectedMethod={selectedPaymentMethod}
                        onAddPaymentMethod={handleAddPaymentMethod}
                      />
                    </Elements>
                  )}
                  {currentStep === 3 && (
                    <BookingConfirmation
                      courseData={courseData}
                      selectedPaymentMethod={selectedPaymentMethod}
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
                        disabled={
                          selectedPaymentMethod === null || isBookingBlocked
                        }
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
                          course={courseData}
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
                        <ClassDetails
                          courseData={courseData}
                          type="trial"
                          address={address}
                        />
                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={handleNextStep}
                            disabled={!isFormValid() || isBookingBlocked}
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
                  <ClassDetails
                    courseData={courseData}
                    type="trial"
                    address={address}
                  />

                  {isParent && (
                    <StudentSelector
                      course={courseData}
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
                        disabled={!isFormValid() || isBookingBlocked}
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
                        selectedStudent={selectedStudent}
                        type="trial"
                      />
                    </div>
                    <div className="col-span-6">
                      <div className="sticky top-24">
                        <ClassDetails
                          courseData={courseData}
                          type="trial"
                          address={address}
                        />
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
                            disabled={
                              selectedPaymentMethod === null || isBookingBlocked
                            }
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
                    courseData={courseData}
                    selectedPaymentMethod={selectedPaymentMethod}
                    selectedStudent={selectedStudent}
                    type="trial"
                  />
                  <ClassDetails
                    courseData={courseData}
                    type="trial"
                    address={address}
                  />
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
                        disabled={
                          selectedPaymentMethod === null || isBookingBlocked
                        }
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
          {isBookingBlocked && (
            <div className="mt-4 rounded-md border border-red-500 bg-red-50 p-3 text-sm text-foreground">
              {isAlreadyPurchasedForSelectedStudent
                ? "This course is already purchased for the selected student."
                : "No remaining lessons are available for this course."}
            </div>
          )}
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
                onClick={() => navigate(`/${currentUser?.role}/dashboard`)}
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
