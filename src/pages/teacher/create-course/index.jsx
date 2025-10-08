import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { commonBreadCrumbData, steps } from "./data";
import Stepper from "./components/Stepper";
import CourseForm from "./components/CourseForm";
import Button from "components/ui/Button";
import LessonForm from "./components/LessonForm";
import { successToast } from "../../../utils/utils";
import Icon from "components/AppIcon";
import { mockCourses } from "../manage-courses/data";

const CreateCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState({
    // Step 1
    courseName: "",
    language: "",
    description: "",
    lessonType: "",
    introImage: "",
    capacity: "",
    ageRange: { min: "", max: "" },
    price: "",
    startDate: "",
    endDate: "",

    // Step 2
    lessons: [
      {
        lessonTitle: "",
        lessonDescription: "",
        trialAvailable: false,
        trialCapacity: 1,
        curriculumGames: false,
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [breadCrumbData, setBreadCrumbData] = useState(
    commonBreadCrumbData?.add
  );
  const defaultLesson = {
    lessonTitle: "",
    lessonDescription: "",
    trialAvailable: false,
    trialCapacity: 1,
    curriculumGames: false,
  };
  const isEdit = mode === "edit";
  const isLesson = location.pathname.includes("lesson");
  const isCreateLesson = location.pathname.includes("create-lesson");

  useEffect(() => {
    if (courseId) {
      setMode("edit");
      setBreadCrumbData(commonBreadCrumbData?.edit);
      isLesson && setCurrentStep(2);
    } else {
      setMode("add");
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      const courseData = mockCourses.find((course) => course?.id === courseId);
      const formData = {
        courseName: courseData?.courseName,
        language: courseData?.language,
        description: courseData?.description,
        capacity: courseData?.capacity,
        lessonType: courseData?.lessonType,
        introImage: courseData?.introImage,
        ageRange: courseData?.ageRange,
        price: courseData?.price,
        startDate: courseData?.startDate,
        endDate: courseData?.endDate,
        lessons: courseData?.lessons || [],
      };
      setFormData(formData);

      if (isCreateLesson) {
        setFormData((prev) => ({
          ...prev,
          lessons: [...(prev.lessons || []), { ...defaultLesson }],
        }));
      }
    }
  }, [courseId]);

  const handleStepClick = (stepId) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 1) {
      if (!formData?.courseName?.trim())
        newErrors.courseName = "Course name is required";
      if (!formData?.introImage?.trim())
        newErrors.introImage = "Intro image is required";
      if (!formData?.language) newErrors.language = "Language is required";
      if (formData?.lessonType === "group" && formData?.capacity < 1)
        newErrors.capacity = "Capacity must be at least 1";
      if (!formData?.startDate) newErrors.startDate = "Start date is required";
    }

    if (step === 2) {
      const lessonErrors = formData.lessons.map((lesson) => {
        let errs = {};

        if (!lesson.lessonTitle?.trim()) {
          errs.lessonTitle = "Lesson title is required";
        }
        if (!lesson.lessonDescription?.trim()) {
          errs.lessonDescription = "Lesson description is required";
        }
        if (lesson.trialAvailable) {
          if (!lesson.trialCapacity) {
            errs.trialCapacity = "Trial capacity is required";
          } else if (lesson.trialCapacity < 1) {
            errs.trialCapacity = "Trial capacity must be at least 1";
          } else if (lesson.trialCapacity > formData?.capacity) {
            errs.trialCapacity =
              "Trial capacity must be less than or equal to student capacity";
          }
        }

        return errs;
      });

      newErrors.lessons = lessonErrors;
    }

    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 0 ||
      (step === 2 &&
        newErrors.lessons.every((l) => Object.keys(l).length === 0))
    );
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleInputChange = (field, value, lessonIndex = null) => {
    let error = null;

    // FILE input only handled at course-level (introImage)
    if (
      lessonIndex === null &&
      field === "introImage" &&
      value instanceof File
    ) {
      const validTypes = ["image/png", "image/jpeg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(value.type)) {
        error = "Only JPG or PNG images are allowed.";
        // store empty string if invalid
        setFormData((prev) => ({ ...prev, [field]: "" }));
      } else if (value.size > maxSize) {
        error = "File size must be less than 2MB.";
        setFormData((prev) => ({ ...prev, [field]: "" }));
      } else {
        // store only filename
        setFormData((prev) => ({ ...prev, [field]: value.name }));
      }

      // update course-level error
      setErrors((prev) => ({ ...prev, [field]: error }));
      return;
    }

    // If updating a lesson's field
    if (lessonIndex !== null) {
      setFormData((prev) => {
        const lessons = [...(prev.lessons || [])];
        lessons[lessonIndex] = {
          ...(lessons[lessonIndex] || {}),
          [field]: value,
        };
        return { ...prev, lessons };
      });

      setErrors((prev) => {
        const lessonsErr = Array.from(prev.lessons || [], (e) => ({
          ...(e || {}),
        }));
        // ensure array long enough
        while (lessonsErr.length <= lessonIndex) lessonsErr.push({});
        lessonsErr[lessonIndex] = {
          ...(lessonsErr[lessonIndex] || {}),
          [field]: error,
        };
        return { ...prev, lessons: lessonsErr };
      });

      return;
    }

    // Course-level non-file fields
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const addLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [...(prev.lessons || []), { ...defaultLesson }],
    }));

    setErrors((prev) => ({
      ...prev,
      lessons: [...(prev.lessons || []), {}],
    }));
  };

  const removeLesson = (index) => {
    setFormData((prev) => {
      const lessons = (prev.lessons || []).filter((_, i) => i !== index);
      return { ...prev, lessons };
    });

    setErrors((prev) => {
      const lessonErrs = (prev.lessons || []).filter((_, i) => i !== index);
      return { ...prev, lessons: lessonErrs };
    });
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    const entity = isLesson ? "Lesson" : "Course";
    const action = isEdit ? "updated" : "created";
    successToast(`${entity} ${action} successfully!`);

    if (isLesson || isCreateLesson) {
      navigate(`/teacher/lessons/${courseId}`);
    } else if (isEdit) {
      navigate("/teacher/manage-courses");
    } else {
      setShowModal(true);
    }
  };

  const onCloseSuccessModal = () => {
    setShowModal(false);
    navigate("/teacher/manage-courses");
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mt-5 mb-10">
              <h1 className="text-2xl font-semibold text-brand-gray-800">
                Course Information
              </h1>
              <p className="text-lg text-brand-gray-500">
                {isEdit ? "Update " : "Set up "}the fundamental details of your
                course
              </p>
            </div>
            <CourseForm {...{ formData, handleInputChange, errors }} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mt-5 mb-10">
              <h1 className="text-2xl font-semibold text-brand-gray-800">
                Lesson Information
              </h1>
              <p className="text-lg text-brand-gray-500">
                {isEdit ? "Update " : "Configure "}lesson type, duration, and
                capacity
              </p>
            </div>
            <LessonForm
              {...{
                formData,
                handleInputChange,
                errors,
                addLesson,
                removeLesson,
                mode,
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <Breadcrumb customPath={breadCrumbData} className="mt-8" />
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {isEdit ? "Update " : "Create New "}Course & Lesson
              </h1>
              <p className="text-muted-foreground">
                {isEdit ? "Update " : "Set up a new "}course with scheduling and
                configuration
              </p>
            </div>
          </div>
        </section>
        <section className="bg-card border border-border rounded-lg my-8 py-6 px-8 lg:px-20">
          <div className="flex justify-center">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>
          {getCurrentStepComponent()}
          <div
            className={`flex mt-8 pt-6 border-t border-border ${
              currentStep < steps.length ? "justify-end" : "justify-between"
            }`}
          >
            {currentStep === steps.length && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                iconName="Check"
                iconPosition="left"
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            )}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-card rounded-lg max-w-md text-center shadow-elevation-3 p-4">
            <div className="flex justify-end">
              <Icon
                name={"X"}
                size={30}
                className="text-brand-gray-800 hover:cursor-pointer"
                onClick={onCloseSuccessModal}
              />
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Check" size={64} color="white" />
              </div>
              <p className="text-h4 font-medium text-brand-gray-800 px-10 mb-6">
                Your course is successfully created
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;
