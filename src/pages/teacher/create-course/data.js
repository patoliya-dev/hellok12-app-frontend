const commonBreadCrumbData = {
  add: [
    { label: "Manage Courses", path: "/teacher/manage-courses" },
    { label: "Create New Course", path: "#", current: true },
  ],
  edit: [
    { label: "Manage Courses", path: "/teacher/manage-courses" },
    { label: "Edit Course", path: "#", current: true },
  ],
};

const steps = [
  { id: 1, title: "Course Info" },
  { id: 2, title: "Lesson Info" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
];

const lessonTypeOptions = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
  { value: "hybrid", label: "Hybrid" },
];

export { commonBreadCrumbData, steps, languageOptions, lessonTypeOptions };
