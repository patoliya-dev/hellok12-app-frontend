// // Existing...

export const mockFetchCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: 'all', label: 'All' },
        { value: 'a', label: 'Course A' },
        { value: 'b', label: 'Course B' },
      ]);
    }, 500);
  });
};

export const mockFetchProgress = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const courseData = {
        a: {
          label: 'Course A',
          progress: 67,
          learningTime: 12.5,
          completedLessons: 50,
          totalLessons: 100,
          pendingLessons: 4,
          monthlyProgress: [
            { month: 'Jan', score: 35 },
            { month: 'Feb', score: 40 },
            { month: 'Mar', score: 42 },
            { month: 'Apr', score: 45 },
            { month: 'May', score: 50 },
            { month: 'Jun', score: 48 },
            { month: 'Jul', score: 50 },
            { month: 'Aug', score: 52 },
          ],
        },
        b: {
          label: 'Course B',
          progress: 45,
          learningTime: 8.2,
          completedLessons: 30,
          totalLessons: 80,
          pendingLessons: 2,
          monthlyProgress: [
            { month: 'Jan', score: 20 },
            { month: 'Feb', score: 25 },
            { month: 'Mar', score: 30 },
            { month: 'Apr', score: 35 },
            { month: 'May', score: 40 },
            { month: 'Jun', score: 42 },
            { month: 'Jul', score: 44 },
            { month: 'Aug', score: 45 },
          ],
        },
      };

      if (courseId === 'all') {
        const courses = Object.values(courseData);
        const numCourses = courses.length;
        const aggregated = {
          label: 'Overall',
          progress: Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / numCourses),
          learningTime: courses.reduce((sum, c) => sum + c.learningTime, 0).toFixed(1),
          completedLessons: courses.reduce((sum, c) => sum + c.completedLessons, 0),
          totalLessons: courses.reduce((sum, c) => sum + c.totalLessons, 0),
          pendingLessons: courses.reduce((sum, c) => sum + c.pendingLessons, 0),
          monthlyProgress: courseData.a.monthlyProgress.map((monthData, index) => ({
            month: monthData.month,
            score: Math.round(
              courses.reduce((sum, c) => sum + (c.monthlyProgress[index]?.score || 0), 0) / numCourses
            ),
          })),
        };
        resolve(aggregated);
      } else {
        resolve(courseData[courseId] || courseData.a);
      }
    }, 500);
  });
};

// src/services/mockApi.ts
// Add these new mock functions to your existing mockApi.ts file.

/**
 * Simulates fetching upcoming lessons from an API.
 * @returns {Promise<ILesson[]>} A promise that resolves with the list of lessons.
 */
export const mockFetchUpcomingLessons = () => {
  const mockData = [
    {
      _id: '1',
      title: 'Spanish Conversation',
      teacher: {
        fullName: 'Mr. Carlos Rodriguez',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.5,
        reviewCount: 52,
        subject: 'Spanish',
      },
      durationInMinutes: 45,
      courseDetails: 'Course A',
      lessonType: 'Group',
      lessonMode: 'Online Course',
      trialLesson: true,
      upcomingDateTime: '2h 0m',
      lessonTime: '08:20 AM',
      additionalTags: ['Trial Lessons'],
      location: 'Online',
      description: 'Quantum mechanics fundamentals and wave-particle duality concepts.',
    },
    {
      _id: '2',
      title: 'Japanese Writing',
      teacher: {
        fullName: 'Ms. Yuki Tanaka',
        profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.8,
        reviewCount: 75,
        subject: 'Japanese',
      },
      durationInMinutes: 90,
      courseDetails: 'Course B',
      lessonType: 'Group',
      lessonMode: 'Online Course',
      trialLesson: false,
      upcomingDateTime: '1d 0h',
      lessonTime: '06:20 AM',
      additionalTags: ['Curriculum-Aligned Games'],
      location: '19 Washington Square N, New York, NY 10011, USA',
      description: 'Fundamentals of Japanese hiragana and katakana writing systems.',
    },
    {
      _id: '3',
      title: 'English Literature',
      teacher: {
        fullName: 'Ms. Sarah Johnson',
        profilePicture: 'https://randomuser.me/api/portraits/women/78.jpg',
        rating: 5.0,
        reviewCount: 31,
        subject: 'English',
      },
      durationInMinutes: 90,
      courseDetails: 'Course C',
      lessonType: '1-on-1',
      lessonMode: 'Online Course',
      trialLesson: false,
      upcomingDateTime: '31 Jul 2025',
      lessonTime: '06:20 AM',
      location: 'Online',
      description: 'An introductory class on classic English novels and poetry.',
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 500); // Simulate network delay
  });
};

// Note: Month is 0-indexed in JavaScript's Date object (0 = January, 6 = July)
const now = new Date();

export const upcomingLessons = [
  {
    _id: 'upcoming1',
    title: 'Spanish Conversation',
    teacherName: 'Mr. Carlos Rodriguez',
    teacherImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    duration: 45,
    course: 'A',
    type: 'Group',
    modality: 'Online Course',
    tags: ['Trial Lessons'],
    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: 'Upcoming',
  },
  {
    _id: 'upcoming2',
    title: 'Japanese Writing',
    teacherName: 'Ms. Yuki Tanaka',
    teacherImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    duration: 90,
    course: 'B',
    type: 'Group',
    modality: 'Online Course',
    tags: ['Curriculum-Aligned Games'],
    startTime: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(), // 1 day + 1 hour from now
    status: 'Upcoming',
  },
  {
    _id: 'upcoming3',
    title: 'English Literature',
    teacherName: 'Ms. Sarah Johnson',
    teacherImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    duration: 90,
    course: 'C',
    type: '1-on-1',
    modality: 'Online Course',
    tags: [],
    startTime: new Date(2025, 6, 31, 6, 20, 0).toISOString(), // July 31, 2025
    status: 'Upcoming',
  },
];

export const historyLessons = [
  {
    _id: 'history1',
    title: 'Spanish Conversation',
    teacherName: 'Mr. Carlos Rodriguez',
    teacherImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    duration: 45,
    course: 'A',
    type: 'Group',
    modality: 'Online Course',
    tags: ['Trial Lessons'],
    startTime: new Date(2025, 6, 31, 8, 20, 0).toISOString(), // July 31, 2025
    status: 'Completed',
  },
  {
    _id: 'history2',
    title: 'Japanese Writing',
    teacherName: 'Ms. Yuki Tanaka',
    teacherImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    duration: 90,
    course: 'B',
    type: 'Group',
    modality: 'Online Course',
    tags: ['Curriculum-Aligned Games'],
    startTime: new Date(2025, 6, 25, 6, 20, 0).toISOString(), // July 25, 2025
    status: 'Cancelled',
  },
  {
    _id: 'history3',
    title: 'English Literature',
    teacherName: 'Ms. Sarah Johnson',
    teacherImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    duration: 90,
    course: 'C',
    type: '1-on-1',
    modality: 'Online Course',
    tags: [],
    startTime: new Date(2025, 6, 18, 8, 20, 0).toISOString(), // July 18, 2025
    status: 'Completed',
  },
];