export const buildCourseEditPolicy = ({
  isEdit = false,
  enrolledCount = 0,
  capabilities = {},
} = {}) => {
  const enrollmentStarted = isEdit && Number(enrolledCount || 0) > 0;

  const allowCourseFieldEditsAfterEnrollment =
    capabilities.allowCourseFieldEditsAfterEnrollment || [];
  const allowLessonFieldEditsAfterEnrollment =
    capabilities.allowLessonFieldEditsAfterEnrollment || [];

  const canEditCourseField = (field) =>
    !enrollmentStarted || allowCourseFieldEditsAfterEnrollment.includes(field);

  const canEditLessonField = (field) =>
    !enrollmentStarted || allowLessonFieldEditsAfterEnrollment.includes(field);

  const canAddLesson =
    !enrollmentStarted || !!capabilities.allowAddLessonAfterEnrollment;
  const canRemoveLesson =
    !enrollmentStarted || !!capabilities.allowRemoveLessonAfterEnrollment;
  const canSubmit =
    !enrollmentStarted || !!capabilities.allowSubmitCourseChangesAfterEnrollment;
  const canManageSessions =
    enrollmentStarted && capabilities.allowSessionOpsAfterEnrollment !== false;

  return {
    enrollmentStarted,
    canEditCourseField,
    canEditLessonField,
    canAddLesson,
    canRemoveLesson,
    canSubmit,
    canManageSessions,
    lockReason:
      "Editing is locked because enrollments already started for this course.",
  };
};
