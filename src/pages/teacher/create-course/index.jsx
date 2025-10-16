import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { commonBreadCrumbData, steps } from "./data";
import Stepper from "./components/Stepper";
import CourseForm from "./components/CourseForm";
import Button from "components/ui/Button";
import LessonForm from "./components/LessonForm";
import { successToast } from "../../../utils/utils";
import Icon from "components/AppIcon";

// THUNKS (make sure these paths match your project)
import {
  createCourse as createCourseThunk,
  updateCourse as updateCourseThunk,
  fetchCourse as fetchCourseThunk,
  fetchCourseWithLessons as fetchCourseWithLessonsThunk
} from "../../../reducers/courses/courseThunks";
import { createLessons as createLessonThunk } from "../../../reducers/lessons/lessonThunks";
import {
  presignAttachment,
  uploadToS3,
  completeAttachment,
  claimAttachment,
} from "../../../reducers/attachments/attachmentThunks";
import { formatDateForDateInput } from "../../../utils/formatters";

const CreateCourse = () => {
  const { courseId } = useParams();
  console.log('courseId', courseId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState({
    // Step 1
    title: "",
    language: "",
    description: "",
    lessonType: "",
    mode: "",
    introImage: "",            // display-only filename
    introImageRef: null,       // { attachmentId, url } set after upload
    studentCapacity: "",
    ageGroups: [],
    price: "",
    startDate: "",
    endDate: "",

    // Step 2
    lessons: [
      {
        title: "",
        description: "",
        trialAvailable: false,
        trialCapacity: 1,
        schedule: {
          date: "",
          time: "",
          duration: "",
        }
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [breadCrumbData, setBreadCrumbData] = useState(commonBreadCrumbData?.add);
  const [introUpload, setIntroUpload] = useState({ loading: false, progress: 0, error: null });

  const defaultLesson = {
    title: "",
    description: "",
    trialAvailable: false,
    trialCapacity: 1,
  };

  const isEdit = mode === "edit";
  const isLesson = location.pathname.includes("lesson");
  const isCreateLesson = location.pathname.includes("create-lesson");

  useEffect(() => {
    if (courseId) {
      setMode("edit");
      setBreadCrumbData(commonBreadCrumbData?.edit);
      isLesson && setCurrentStep(2);
      // NOTE: you can fetch the existing course here if needed and hydrate formData
      // using your course detail thunk (kept lightweight to respect your current screen).
    } else {
      setMode("add");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // If you were previously reading from mock, this keeps the “add extra lesson” UX intact in edit/lesson route.
  useEffect(() => {
    if (courseId) {
      (async () => {
        const courseData = await dispatch(
          fetchCourseThunk(courseId)).unwrap();
        // const { data } = courseData;
        console.log('courseData', courseData);
        const lessonList = await dispatch(
          fetchCourseWithLessonsThunk(courseId)).unwrap();
        setFormData({ ...courseData, startDate: formatDateForDateInput(courseData.startDate), endDate: formatDateForDateInput(courseData.endDate), lessons: lessonList?.length ? lessonList : formData.lessons });

      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleStepClick = (stepId) => {
    if (stepId < currentStep) setCurrentStep(stepId);
  };

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 1) {
      if (!formData?.title?.trim())
        newErrors.title = "Course name is required";
      if (!formData?.introImageRef?.attachmentId)
        newErrors.introImage = "Intro image is required";
      if (!formData?.language) newErrors.language = "Language is required";
      if (formData?.lessonType === "group" && Number(formData?.studentCapacity) < 1)
        newErrors.studentCapacity = "Capacity must be at least 1";
      if (!formData?.startDate) newErrors.startDate = "Start date is required";
      if (!formData?.mode)
        newErrors.mode = "Lesson mode is required";
    }

    if (step === 2) {
      const lessonErrors = formData.lessons.map((lesson) => {
        let errs = {};
        if (!lesson.title?.trim()) errs.title = "Lesson title is required";
        if (!lesson.description?.trim())
          errs.description = "Lesson description is required";
        if (lesson.trialAvailable) {
          const cap = Number(lesson.trialCapacity || 0);
          if (!cap) errs.trialCapacity = "Trial capacity is required";
          else if (cap < 1) errs.trialCapacity = "Trial capacity must be at least 1";
          else if (formData?.studentCapacity && cap > Number(formData.studentCapacity)) {
            errs.trialCapacity = "Trial capacity must be ≤ student capacity";
          }
        }
        return errs;
      });
      newErrors.lessons = lessonErrors;
    }

    setErrors(newErrors);
    console.log('newErrors', newErrors);

    return (
      Object.keys(newErrors).length === 0 ||
      (step === 2 &&
        newErrors.lessons.every((l) => Object.keys(l).length === 0))
    );
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((p) => p + 1);
  };

  const handlePrevious = () => setCurrentStep((p) => p - 1);

  /**
   * Centralized course-level + lesson-level change handler
   * Also wires Intro Image upload via Attachment API (presign → S3 → complete)
   */
  const handleInputChange = async (field, value, lessonIndex = null) => {
    let error = null;

    // Special case: intro image file -> upload now
    if (lessonIndex === null && field === "introImage" && value instanceof File) {
      const file = value;
      const validTypes = ["image/png", "image/jpeg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        error = "Only JPG or PNG images are allowed.";
        setFormData((prev) => ({ ...prev, introImage: "", introImageRef: null }));
        setErrors((prev) => ({ ...prev, introImage: error }));
        return;
      }
      if (file.size > maxSize) {
        error = "File size must be less than 2MB.";
        setFormData((prev) => ({ ...prev, introImage: "", introImageRef: null }));
        setErrors((prev) => ({ ...prev, introImage: error }));
        return;
      }

      try {
        setIntroUpload({ loading: true, progress: 1, error: null });
        // 1) Presign
        const presignRes = await dispatch(
          presignAttachment({
            filename: file.name,
            mime: file.type,
            size: file.size,
            entityType: "Course",
            entityId: "",
            scope: "intro",
          })
        ).unwrap();

        const { key, upload } = presignRes;

        // 2) Upload to S3
        await dispatch(uploadToS3({
          upload,
          file,
          onProgress: (pct) => setIntroUpload((s) => ({ ...s, progress: pct }))
        })).unwrap();

        // 3) Complete
        const finalized = await dispatch(
          completeAttachment({
            "key": key,
            "entityType": "Course",
            // "entityId": entityId
          })
        ).unwrap();

        setFormData((prev) => ({
          ...prev,
          introImage: file.name,
          introImageRef: {
            attachmentId: finalized?._id,
            url: finalized?.url || presignRes?.url || null,
          },
        }));
        setErrors((prev) => ({ ...prev, introImage: null }));
        setIntroUpload({ loading: false, progress: 100, error: null });
      } catch (e) {
        setFormData((prev) => ({ ...prev, introImage: "", introImageRef: null }));
        setErrors((prev) => ({
          ...prev,
          introImage: e?.message || "Image upload failed",
        }));
        setIntroUpload({ loading: false, progress: 0, error: e?.message || "Upload failed" });
      }
      return;
    }

    // Lesson-level field
    if (lessonIndex !== null) {
      setFormData((prev) => {
        const lessons = [...(prev.lessons || [])];
        lessons[lessonIndex] = {
          ...(lessons[lessonIndex] || {}),
          [field]: value,
        };
        return { ...prev, lessons };
      });

      // manage lesson-level error container shape
      setErrors((prev) => {
        const lessonErrs = Array.from(prev.lessons || [], (e) => ({ ...(e || {}) }));
        while (lessonErrs.length <= lessonIndex) lessonErrs.push({});
        lessonErrs[lessonIndex] = { ...(lessonErrs[lessonIndex] || {}), [field]: error };
        return { ...prev, lessons: lessonErrs };
      });
      return;
    }

    // Course-level non-file field
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

  /**
   * Submit:
   *  - create/update course
   *  - create lessons (sequential)
   */
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    // Build course payload (align to BE contracts)
    const coursePayload = {
      title: formData.title,
      language: formData.language,
      description: formData.description || undefined,
      lessonType: formData.lessonType,
      studentCapacity:
        formData.lessonType === "group" ? Number(formData.studentCapacity || 0) : 1,
      mode: formData.mode,
      pricePerLesson: Number(formData.price || 0),
      ageGroups: formData.ageGroups,
      // ageRange: {
      //   min: formData?.ageRange?.min ? Number(formData.ageRange.min) : undefined,
      //   max: formData?.ageRange?.max ? Number(formData.ageRange.max) : undefined,
      // },
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      introImage: formData.introImageRef
        ? { attachmentId: formData.introImageRef.attachmentId }
        : undefined,
      introImageRef: formData.introImageRef.attachmentId
    };

    try {
      let savedCourse;
      if (isEdit && courseId) {
        const r = await dispatch(
          updateCourseThunk({ id: courseId, patch: coursePayload })
        ).unwrap();
        savedCourse = r;
        successToast("Course updated successfully!");
      } else {
        const r = await dispatch(createCourseThunk(coursePayload)).unwrap();
        savedCourse = r;
        successToast("Course created successfully!");
      }

      // Claim the intro image to the created/updated course (if present)
      if (savedCourse?._id && formData?.introImageRef?.attachmentId) {
        try {
          const claimed = await dispatch(
            claimAttachment({
              attachmentId: formData.introImageRef.attachmentId,
              entityType: "Course",
              entityId: savedCourse._id,
              moveToEntityPrefix: true, // moves S3 object under courses/<courseId>/intro/
              scope: "intro",
            })
          ).unwrap();
          // Optionally update local state with final URL after move:
          if (claimed?.url) {
            setFormData((prev) => ({
              ...prev,
              introImageRef: { ...prev.introImageRef, url: claimed.url },
            }));
          }
        } catch (e) {
          // Non-blocking: the course is created; attachment can be claimed later
          console.warn("Attachment claim failed:", e);
        }
      }

      // If we are on the lesson route or creating a new course (step 2 present),
      // create lessons sequentially so we surface any error clearly.
      if (savedCourse?._id && formData?.lessons?.length) {
        const payload = formData.lessons.map((l) => ({
          title: l.title,
          description: l.description || undefined,
          isTrial: !!l.trialAvailable,
          trialCapacity: l.trialAvailable ? Number(l.trialCapacity || 0) : undefined,
          order: typeof l.order === 'number' ? l.order : undefined,
          schedule: {
            date: l.schedule?.date,          // "YYYY-MM-DD"
            time: l.schedule?.time,          // "HH:MM AM/PM"
            duration: Number(l.schedule?.duration || 60)
          }
        }));

        // If staying with thunks, add a thunk or call your fetcher directly:
        await dispatch(
          createLessonThunk({ courseId: savedCourse._id, payload: { lessons: payload } })
        ).unwrap();
      }

      successToast(`${isEdit ? "Course updated" : "Course created"} successfully!`);
      if (isLesson || isCreateLesson) {
        navigate(`/teacher/lessons/${savedCourse?._id || courseId}`);
      } else if (isEdit) {
        navigate("/teacher/manage-courses");
      } else {
        setShowModal(true);
      }
    } catch (err) {
      // Friendly handling for 409/422 style errors
      const msg =
        err?.message ||
        err?.error ||
        err?.details?.message ||
        "Unable to save course. Please review your inputs.";
      alert(msg);
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
            <CourseForm {...{ formData, handleInputChange, errors, introUpload }} />
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
            className={`flex mt-8 pt-6 border-t border-border ${currentStep < steps.length ? "justify-end" : "justify-between"
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
                disabled={introUpload.loading}
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
