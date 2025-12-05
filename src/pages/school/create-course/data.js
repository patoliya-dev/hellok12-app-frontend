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

const lessonTypeOptions = [
  { value: "1-on-1", label: "1-on-1" },
  { value: "group", label: "Group" },
];

const lessonModeOptions = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
];

// Mock teachers data for assignment dropdown
const mockTeachers = [
  { value: "teacher_1", label: "Sarah Johnson", specialization: "Spanish" },
  {
    value: "teacher_2",
    label: "Michael Chen",
    specialization: "Mandarin Chinese",
  },
  { value: "teacher_3", label: "Emma Rodriguez", label: "French & Spanish" },
  { value: "teacher_4", label: "David Kim", specialization: "Korean" },
  { value: "teacher_5", label: "Lisa Thompson", specialization: "German" },
  {
    value: "teacher_6",
    label: "Carlos Martinez",
    specialization: "Portuguese",
  },
  { value: "teacher_7", label: "Anna Kowalski", specialization: "Polish" },
  { value: "teacher_8", label: "Yuki Tanaka", specialization: "Japanese" },
];

// Mock courses data for testing edit functionality
const mockCourses = {
  mock_course_1: {
    _id: "mock_course_1",
    title: "Spanish for Beginners",
    languageCode: "es",
    description:
      "Learn the basics of Spanish language including grammar, vocabulary, and conversation skills.",
    lessonType: "group",
    mode: "online",
    studentCapacity: 10,
    price: 299,
    ageGroups: ["6-8", "9-12"],
    startDate: "2025-01-15",
    endDate: "2025-03-15",
    introImageRef: {
      attachmentId: "mock_attachment_spanish",
      url: "https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=400",
    },
    teachers: ["teacher_123"],
    lessons: [
      {
        _id: "lesson_1",
        title: "Introduction to Spanish",
        description: "Learn basic greetings and introductions in Spanish",
        assignedTeacher: "teacher_1",
        isTrialAvailable: true,
        trialCapacity: 5,
        schedule: {
          date: "2025-01-15",
          time: "10:00",
          duration: 60,
        },
      },
      {
        _id: "lesson_2",
        title: "Spanish Alphabet and Pronunciation",
        description: "Master the Spanish alphabet and correct pronunciation",
        assignedTeacher: "teacher_3",
        isTrialAvailable: false,
        trialCapacity: 0,
        schedule: {
          date: "2025-01-22",
          time: "10:00",
          duration: 60,
        },
      },
      {
        _id: "lesson_3",
        title: "Common Spanish Phrases",
        description: "Learn everyday phrases for common situations",
        assignedTeacher: "teacher_1",
        isTrialAvailable: false,
        trialCapacity: 0,
        schedule: {
          date: "2025-01-29",
          time: "10:00",
          duration: 90,
        },
      },
    ],
  },
  mock_course_2: {
    _id: "mock_course_2",
    title: "Advanced French Conversation",
    languageCode: "fr",
    description:
      "Improve your French speaking skills through interactive conversations and discussions.",
    lessonType: "1-on-1",
    mode: "online",
    studentCapacity: 1,
    price: 499,
    ageGroups: ["13-15", "16-18"],
    startDate: "2025-02-01",
    endDate: "2025-04-30",
    introImageRef: {
      attachmentId: "mock_attachment_french",
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
    },
    teachers: ["teacher_123"],
    lessons: [
      {
        _id: "lesson_4",
        title: "French Idioms and Expressions",
        description: "Learn common French idioms used in everyday conversation",
        assignedTeacher: "teacher_3",
        isTrialAvailable: true,
        trialCapacity: 1,
        schedule: {
          date: "2025-02-01",
          time: "14:00",
          duration: 45,
        },
      },
      {
        _id: "lesson_5",
        title: "Debating in French",
        description:
          "Practice expressing opinions and debating topics in French",
        assignedTeacher: "teacher_3",
        isTrialAvailable: false,
        trialCapacity: 0,
        schedule: {
          date: "2025-02-08",
          time: "14:00",
          duration: 60,
        },
      },
    ],
  },
  mock_course_3: {
    _id: "mock_course_3",
    title: "Mandarin Chinese Basics",
    languageCode: "zh",
    description:
      "Start your journey learning Mandarin Chinese with fundamental characters and tones.",
    lessonType: "group",
    mode: "in-person",
    studentCapacity: 8,
    price: 399,
    ageGroups: ["9-12", "13-15"],
    startDate: "2025-01-20",
    endDate: "2025-05-20",
    introImageRef: {
      attachmentId: "mock_attachment_chinese",
      url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400",
    },
    teachers: ["teacher_123"],
    lessons: [
      {
        _id: "lesson_6",
        title: "Chinese Tones and Pinyin",
        description: "Master the four tones and pinyin romanization system",
        assignedTeacher: "teacher_2",
        isTrialAvailable: true,
        trialCapacity: 3,
        schedule: {
          date: "2025-01-20",
          time: "16:00",
          duration: 60,
        },
      },
      {
        _id: "lesson_7",
        title: "Basic Chinese Characters",
        description:
          "Learn to write and recognize fundamental Chinese characters",
        assignedTeacher: "teacher_2",
        isTrialAvailable: false,
        trialCapacity: 0,
        schedule: {
          date: "2025-01-27",
          time: "16:00",
          duration: 75,
        },
      },
      {
        _id: "lesson_8",
        title: "Chinese Numbers and Counting",
        description: "Learn numbers, counting, and basic math in Chinese",
        assignedTeacher: "teacher_2",
        isTrialAvailable: false,
        trialCapacity: 0,
        schedule: {
          date: "2025-02-03",
          time: "16:00",
          duration: 60,
        },
      },
    ],
  },
};

export {
  commonBreadCrumbData,
  steps,
  lessonTypeOptions,
  lessonModeOptions,
  mockTeachers,
  mockCourses,
};
