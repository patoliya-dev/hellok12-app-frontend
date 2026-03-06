import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { commonBreadCrumbData, steps, mockCourses } from "./data";
import Stepper from "./components/Stepper";
import CourseForm from "./components/CourseForm";
import Button from "components/ui/Button";
import LessonForm from "./components/LessonForm";
import Icon from "components/AppIcon";
import {
  createCourse as createCourseThunk,
  updateCourse as updateCourseThunk,
  fetchCourse as fetchCourseThunk,
} from "../../../reducers/courses/courseThunks";
import {
  createLessons as createLessonsThunk,
  updateLessons as updateLessonsThunk,
} from "../../../reducers/lessons/lessonThunks";
import {
  uploadAttachmentFlow,
  claimAttachment,
} from "../../../reducers/attachments/attachmentThunks";
import {
  errorToast,
  safeParseArray,
  setIn,
  successToast,
  toBracketPath,
} from "../../../utils/utils";
import { formatDateForDateInput } from "../../../utils/formatters";
import { buildCourseEditPolicy } from "../../../utils/courseEditPolicy";
import { validateSchedule } from "./utils/validateSchedule";
import {
  buildPartialUpdate,
  mapLessonFromApi,
  mapLessonToCreatePayload,
} from "./mappers/lessons";
import { buildLessonMutations } from "../../teacher/create-course/mappers/diff";
import {
  applyLessonApiErrorsToForm,
  applyUpdateApiErrorsToForm,
} from "../manage-courses/utils/mapApiFieldErrors";
import { clearCreateError } from "../../../reducers/lessons/lessonsSlice";
import PageLoaderOverlay from "components/ui/PageLoaderOverlay";
import { selectPageLoading } from "../../../reducers/ui/pageLoaderSlice";

const CreateCourse = () => {
  const { user } = useSelector((s) => s.auth);
  const originalLessonsRef = useRef([]);
  const lastSubmittedUpdatesRef = useRef(null);
  const lastActionRef = useRef(null);
  const { courseId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Page loader state
  const pageLoading = useSelector(selectPageLoading);

  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState({
    // Step 1
    title: "",
    languageCode: "",
    description: "",
    lessonType: "",
    mode: "",
    introImage: "", // display-only filename
    introImageRef: null, // { attachmentId, url } set after upload
    studentCapacity: "",
    ageGroups: [],
    price: "",
    startDate: "",
    endDate: "",
    teachers: user.role === "teacher" ? [user.id] : [],

    // Step 2
    lessons: [
      {
        title: "",
        description: "",
        assignedTeacher: "",
        isTrialAvailable: false,
        trialCapacity: 1,
        schedule: {
          date: "",
          time: "",
          duration: 60,
        },
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [breadCrumbData, setBreadCrumbData] = useState(
    commonBreadCrumbData?.add
  );
  const [introUpload, setIntroUpload] = useState({
    loading: false,
    progress: 0,
    error: null,
  });

  const defaultLesson = {
    title: "",
    description: "",
    teachers: [],
    isTrialAvailable: false,
    trialCapacity: 0,
    schedule: { duration: 60 },
  };

  const isEdit = mode === "edit";
  const isLesson = location.pathname.includes("lesson");
  const isCreateLesson = location.pathname.includes("create-lesson");
  const editPolicy = buildCourseEditPolicy({
    isEdit,
    enrolledCount: formData?.enrolledCount,
  });
  const isEnrollmentStarted = editPolicy.enrollmentStarted;

  const {
    loading: lessonsSaving,
    error: lessonsError,
    fieldErrors,
  } = useSelector((s) => s.lessons.create);

  // Whenever fieldErrors appear, push them into local `errors` state
  useEffect(() => {
    if (!fieldErrors || currentStep !== 2) return;

    if (lastActionRef.current === "create") {
      // create errors
      applyLessonApiErrorsToForm(fieldErrors, setErrors);
    } else if (
      lastActionRef.current === "update" &&
      Array.isArray(lastSubmittedUpdatesRef.current)
    ) {
      // update errors
      applyUpdateApiErrorsToForm(
        fieldErrors,
        lastSubmittedUpdatesRef.current,
        formData.lessons || [],
        setErrors
      );
    }
  }, [fieldErrors, currentStep, formData.lessons, setErrors]);

  useEffect(() => {
    if (currentStep !== 2 && (lessonsError || fieldErrors)) {
      dispatch(clearCreateError());
      lastActionRef.current = null;
      lastSubmittedUpdatesRef.current = null;
    }
  }, [currentStep, lessonsError, fieldErrors, dispatch]);

  // If you were previously reading from mock, this keeps the "add extra lesson" UX intact in edit/lesson route.
  useEffect(() => {
    if (courseId) {
      (async () => {
        setMode("edit");
        setBreadCrumbData(commonBreadCrumbData?.edit);
        isLesson && setCurrentStep(2);

        const course = await dispatch(fetchCourseThunk(courseId)).unwrap();
        const lessons = (course?.lessons || []).map(mapLessonFromApi);
        originalLessonsRef.current = course.lessons;
        setFormData((prev) => ({
          ...prev,
          ...course,
          teachers: course.teachers || [],
          startDate: formatDateForDateInput(course.startDate),
          endDate: formatDateForDateInput(course.endDate),
          lessons: lessons?.length ? lessons : prev.lessons,
        }));
      })();
    } else {
      setMode("add");
    }
  }, [courseId]);

  const handleStepClick = (stepId) => {
    if (stepId < currentStep) setCurrentStep(stepId);
  };

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 1) {
      if (!formData?.title?.trim()) newErrors.title = "Course name is required";
      if (!formData?.description?.trim())
        newErrors.description = "Description is required";
      if (
        !formData?.introImageRef?.attachmentId &&
        !formData?.introImageRef?.url
      )
        newErrors.introImage = "Intro image is required";
      if (!formData?.languageCode)
        newErrors.languageCode = "Language is required";
      if (
        formData?.lessonType === "group" &&
        Number(formData?.studentCapacity) < 1
      )
        newErrors.studentCapacity = "Capacity must be at least 1";
      if (!formData?.startDate) newErrors.startDate = "Start date is required";
      if (!formData?.mode) newErrors.mode = "Lesson mode is required";
    }

    if (step === 2) {
      const lessonErrors = formData.lessons.map((lesson) => {
        let errs = {};
        if (!lesson.title?.trim()) errs.title = "Lesson title is required";
        if (!lesson.description?.trim())
          errs.description = "Lesson description is required";

        const scheduleErrs = validateSchedule(lesson.schedule);
        if (Object.keys(scheduleErrs).length) errs.schedule = scheduleErrs;

        if (lesson.isTrialAvailable) {
          const cap = Number(lesson.trialCapacity || 0);
          if (!cap) errs.trialCapacity = "Trial capacity is required";
          else if (cap < 1)
            errs.trialCapacity = "Trial capacity must be at least 1";
          else if (
            formData?.studentCapacity &&
            cap > Number(formData.studentCapacity)
          ) {
            errs.trialCapacity = "Trial capacity must be ≤ student capacity";
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
    if (validateStep(currentStep)) setCurrentStep((p) => p + 1);
  };

  const handlePrevious = () => setCurrentStep((p) => p - 1);

  /**
   * Centralized course-level + lesson-level change handler
   * Also wires Intro Image upload via Attachment API (presign → S3 → complete)
   */
  const handleInputChange = async (field, value, lessonIndex = null) => {
    const canEdit =
      lessonIndex !== null
        ? editPolicy.canEditLessonField(field)
        : editPolicy.canEditCourseField(field);
    if (!canEdit) return;
    let error = null;
    // Special case: intro image file -> upload now
    if (
      lessonIndex === null &&
      field === "introImage" &&
      value instanceof File
    ) {
      const file = value;
      const validTypes = ["image/png", "image/jpeg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        error = "Only JPG or PNG images are allowed.";
        setFormData((prev) => ({
          ...prev,
          introImage: "",
          introImageRef: null,
        }));
        setErrors((prev) => ({ ...prev, introImage: error }));
        return;
      }
      if (file.size > maxSize) {
        error = "File size must be less than 2MB.";
        setFormData((prev) => ({
          ...prev,
          introImage: "",
          introImageRef: null,
        }));
        setErrors((prev) => ({ ...prev, introImage: error }));
        return;
      }

      try {
        setIntroUpload({ loading: true, progress: 1, error: null });

        const finalized = await dispatch(
          uploadAttachmentFlow({
            file,
            entityType: "Course",
            entityId: "",
            scope: "intro",
            onProgress: (pct) =>
              setIntroUpload((s) => ({ ...s, progress: pct })),
          })
        ).unwrap();

        setFormData((prev) => ({
          ...prev,
          introImage: file.name,
          introImageRef: {
            attachmentId: finalized.attachmentId,
            url: finalized.url,
          },
        }));
        setErrors((prev) => ({ ...prev, introImage: null }));
        setIntroUpload({ loading: false, progress: 100, error: null });
      } catch (e) {
        setFormData((prev) => ({
          ...prev,
          introImage: "",
          introImageRef: null,
        }));
        setErrors((prev) => ({
          ...prev,
          introImage: e?.message || "Image upload failed",
        }));
        setIntroUpload({
          loading: false,
          progress: 0,
          error: e?.message || "Upload failed",
        });
      }
      return;
    }

    // Compose the correct path
    const targetPath =
      lessonIndex !== null ? `lessons[${lessonIndex}].${field}` : field;

    // Write value immutably
    setFormData((prev) => {
      let updated = setIn(prev || {}, targetPath, value);

      // If updating lesson-level assignedTeacher, also update course-level teachers
      // Collect all unique assignedTeacher values from all lessons
      if (lessonIndex !== null && field === "assignedTeacher") {
        const allTeacherIds = new Set();
        (updated.lessons || []).forEach((lesson) => {
          if (lesson.assignedTeacher) {
            allTeacherIds.add(lesson.assignedTeacher);
          }
        });
        updated = { ...updated, teachers: Array.from(allTeacherIds) };
      }

      return updated;
    });

    // Mirror errors shape
    setErrors((prev) => setIn(prev || {}, targetPath, error));
  };

  const addLesson = () => {
    if (!editPolicy.canAddLesson) return;
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
    if (!editPolicy.canRemoveLesson) return;
    setFormData((prev) => {
      const lessons = (prev.lessons || []).filter((_, i) => i !== index);
      return { ...prev, lessons };
    });
    setErrors((prev) => {
      const lessonErrs = (prev.lessons || []).filter((_, i) => i !== index);
      return { ...prev, lessons: lessonErrs };
    });
  };

  const handleSubmit = async () => {
    if (!editPolicy.canSubmit) {
      errorToast(editPolicy.lockReason);
      return;
    }
    if (!validateStep(currentStep)) return;
    // Build course payload (align to BE contracts)
    const coursePayload = {
      title: formData.title,
      languageCode: formData.languageCode,
      description: formData.description || undefined,
      lessonType: formData.lessonType,
      studentCapacity:
        formData.lessonType === "group"
          ? Number(formData.studentCapacity || 0)
          : 1,
      mode: formData.mode,
      price: Number(formData.price || 0),
      ageGroups: formData.ageGroups,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      introImage: formData.introImageRef
        ? { attachmentId: formData.introImageRef.attachmentId }
        : undefined,
      introImageRef: formData.introImageRef?.attachmentId,
      teachers: formData.teachers,
    };

    try {
      let savedCourse;
      if (isEdit && courseId) {
        const r = await dispatch(
          updateCourseThunk({ id: courseId, patch: coursePayload })
        ).unwrap();
        savedCourse = r;
      } else {
        const r = await dispatch(createCourseThunk(coursePayload)).unwrap();
        savedCourse = r;
      }

      // Claim the intro image to the created/updated course (if present)
      if (savedCourse?._id && formData?.introImageRef?.attachmentId) {
        try {
          const claimed = await dispatch(
            claimAttachment({
              attachmentId: formData.introImageRef?.attachmentId,
              entityType: "Course",
              entityId: savedCourse._id,
              moveToEntityPrefix: true,
              scope: "intro",
            })
          ).unwrap();
          if (claimed?.url) {
            setFormData((prev) => ({
              ...prev,
              introImageRef: { ...prev.introImageRef, url: claimed.url },
            }));
          }
        } catch (e) {
          console.warn("Attachment claim failed:", e);
        }
      }

      if (savedCourse?._id) {
        const currentLessons = formData.lessons || [];

        if (!isEdit) {
          const createPayload = currentLessons.map(mapLessonToCreatePayload);
          if (createPayload.length) {
            await dispatch(
              createLessonsThunk({
                courseId: savedCourse._id,
                payload: { lessons: createPayload },
              })
            ).unwrap();
          }
        } else {
          const {
            creates,
            updates: _updates,
            deletes,
          } = buildLessonMutations(originalLessonsRef.current, currentLessons);

          const createPayload = creates.map(mapLessonToCreatePayload);
          const updates = [];
          const byId = new Map(
            originalLessonsRef.current.map((x) => [x._id, x])
          );
          for (const n of currentLessons) {
            if (n._id && byId.has(n._id)) {
              const patch = buildPartialUpdate(byId.get(n._id), n);
              if (patch) updates.push(patch);
            }
          }

          if (createPayload.length) {
            lastActionRef.current = "create";
            lastSubmittedUpdatesRef.current = null;
            await dispatch(
              createLessonsThunk({
                courseId: savedCourse._id,
                payload: { lessons: createPayload },
              })
            ).unwrap();
          }

          if (updates.length || deletes.length) {
            lastActionRef.current = "update";
            lastSubmittedUpdatesRef.current = updates;
            await dispatch(
              updateLessonsThunk({
                courseId: savedCourse._id,
                payload: { updates, deletes },
              })
            ).unwrap();
          }

          originalLessonsRef.current = currentLessons.map((l) => ({ ...l }));
        }
      }

      successToast(
        `${isEdit ? "Course updated" : "Course created"} successfully!`
      );

      if (isLesson || isCreateLesson) {
        navigate(`/teacher/lessons/${savedCourse._id}`);
      } else if (isEdit) {
        navigate("/teacher/manage-courses");
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.error("❌ Error during submission:", err);
      // Error handling remains the same
      if (err?.http === 400) {
        const fields =
          err?.details?.fields ||
          (typeof err?.message === "string"
            ? safeParseArray(err.message)
            : null) ||
          [];
        if (fields.length) {
          for (const f of fields) {
            const path = toBracketPath(f.path);
            setErrors((prev) => setIn(prev || {}, path, f.message));
          }
          setCurrentStep(2);
          return;
        }
      }

      if (err?.message === "409_CONFLICT_OVERLAP") {
        errorToast(
          "Lesson schedule overlaps an existing lesson for this teacher/course."
        );
        setCurrentStep(2);
        return;
      }

      const msg =
        err?.message ||
        err?.error ||
        err?.details?.message ||
        "Unable to save course. Please review your inputs.";
      errorToast(msg);
    }
  };

  const onCloseSuccessModal = () => {
    setShowModal(false);
    navigate("/school/manage-courses");
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
            <CourseForm
              {...{
                formData,
                handleInputChange,
                errors,
                introUpload,
                editPolicy,
              }}
            />
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
                editPolicy,
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
      {/* Page loader */}
      <PageLoaderOverlay
        show={pageLoading}
        label="Loading course & lessons..."
      />
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
          {/* STEP CONTENT */}
          {getCurrentStepComponent()}
          {isEnrollmentStarted && (
            <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              This course has active enrollments ({formData?.enrolledCount}).
              Course and lesson templates are locked.
            </div>
          )}

          {/* Step-2 inline banner for server errors */}
          {currentStep === 2 && lessonsError && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive text-destructive">
              {lessonsError}
            </div>
          )}

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
                disabled={introUpload.loading}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                iconName="Check"
                iconPosition="left"
                disabled={lessonsSaving || !editPolicy.canSubmit}
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
