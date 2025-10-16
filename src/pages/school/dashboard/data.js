import ManageCourseIcon from "components/icons/ManageCourseIcon";

const cardData = [
  {
    title: "Active Teachers",
    count: 24,
    icon: "Users",
    bgColor: "bg-brand-blue",
  },
  {
    title: "Scheduled Lessons This Week",
    count: 156,
    icon: "Calendar",
    bgColor: "bg-[#059669]",
    isNavigate: true,
    navigateTo: "/school/scheduled-lessons",
  },
  {
    title: "Total course",
    count: 18,
    iconComponent: ManageCourseIcon,
    bgColor: "bg-accent",
  },
  {
    title: "Monthly Revenue",
    count: "$12,450",
    icon: "DollarSign",
    bgColor: "bg-success",
  },
];

const TAG_CONFIG = {
  group: {
    text: "Group",
    icon: "Users",
    color: "bg-blue-100 text-blue-800",
  },
  "1-on-1": {
    text: "1-on-1",
    icon: "User",
    color: "bg-blue-100 text-blue-800",
  },
  online: {
    text: "Online Course",
    image: "/assets/images/video-camera.svg",
    color: "bg-green-100 text-green-800",
  },
  "in-person": {
    text: "In-Person",
    icon: "MapPin",
    color: "bg-green-100 text-green-800",
  },
  CurriculumGames: {
    text: "Curriculum-Aligned Games",
    icon: "Gamepad2",
    color: "bg-orange-100 text-orange-800",
  },
  TrailAvailable: {
    text: "Trial Lessons",
    icon: "Gift",
    color: "bg-[#DDF2FF] text-[#009DFF]",
  },
};

const mockLessons = [
  {
    id: 1,
    studentName: "Emma Johnson",
    studentImage:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    studentAge: 12,
    subject: "English Literature",
    status: "starting-soon",
    description:
      "A deep dive into Shakespeare's sonnets and their impact on modern literature.",
    lessonType: "group",
    lessonMode: "online",
    isTrailAvailable: true,
    isCurriculumGames: false,
    lessonDate: "2023-08-15",
    startTime: new Date(Date.now() + 15 * 60 * 1000),
    endTime: new Date(Date.now() + 75 * 60 * 1000),
    duration: 60,
    teacher: {
      name: "Ms. Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    },
    courseId: "1",
    title: "English Literature",
    createdAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    studentName: "Liam Carter",
    studentImage:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    studentAge: 10,
    subject: "Mathematics",
    status: "starting-soon",
    description:
      "Exploring fractions and decimals through fun visual exercises.",
    lessonType: "1-on-1",
    lessonMode: "online",
    isTrailAvailable: false,
    isCurriculumGames: true,
    lessonDate: "2023-08-16",
    startTime: new Date(Date.now() + 30 * 60 * 1000),
    endTime: new Date(Date.now() + 90 * 60 * 1000),
    duration: 60,
    teacher: {
      name: "Mr. James Miller",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    courseId: "1",
    title: "English Literature",
    createdAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    studentName: "Sophia Brown",
    studentImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    studentAge: 11,
    subject: "Science",
    status: "scheduled",
    description:
      "An introduction to the solar system with interactive experiments.",
    lessonType: "group",
    lessonMode: "in-person",
    address: "45 Greenfield Avenue, New York, NY",
    isTrailAvailable: true,
    isCurriculumGames: true,
    lessonDate: "2023-08-17",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    duration: 60,
    teacher: {
      name: "Ms. Olivia Thompson",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    },
    courseId: "2",
    title: "Spanish Conversation",
    createdAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    studentName: "Noah Davis",
    studentImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    studentAge: 13,
    subject: "History",
    status: "starting-soon",
    description:
      "Discovering the key events of the Renaissance era through storytelling.",
    lessonType: "1-on-1",
    lessonMode: "in-person",
    address: "22 Baker Street, London, UK",
    isTrailAvailable: false,
    isCurriculumGames: false,
    lessonDate: "2023-08-18",
    startTime: new Date(Date.now() + 45 * 60 * 1000),
    endTime: new Date(Date.now() + 105 * 60 * 1000),
    duration: 60,
    teacher: {
      name: "Mr. Ethan Wilson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    courseId: "2",
    title: "Spanish Conversation",
    createdAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    studentName: "Ava Martinez",
    studentImage:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    studentAge: 9,
    subject: "Art & Creativity",
    status: "pending",
    description:
      "Creating beautiful landscapes using basic watercolor techniques.",
    lessonType: "group",
    lessonMode: "online",
    isTrailAvailable: true,
    isCurriculumGames: true,
    lessonDate: "2023-08-19",
    startTime: new Date(Date.now() + 10 * 60 * 1000),
    endTime: new Date(Date.now() + 70 * 60 * 1000),
    duration: 60,
    teacher: {
      name: "Ms. Lily Anderson",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    },
    courseId: "3",
    title: "Japanese Writing",
    createdAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 6,
    studentName: "Lucas White",
    studentImage:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
    studentAge: 14,
    subject: "Physics",
    status: "scheduled",
    description: "Understanding motion and forces through simple experiments.",
    lessonType: "1-on-1",
    lessonMode: "in-person",
    address: "120 King Street, Toronto, Canada",
    isTrailAvailable: false,
    isCurriculumGames: true,
    lessonDate: "2023-08-20",
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    duration: 60,
    teacher: {
      name: "Dr. Henry Collins",
      avatar:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
    },
    courseId: "3",
    title: "Japanese Writing",
    createdAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

export { cardData, mockLessons, TAG_CONFIG };
