// // Existing...

export const mockFetchCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: "all", label: "All" },
        { value: "a", label: "Course A" },
        { value: "b", label: "Course B" },
      ]);
    }, 500);
  });
};

export const mockFetchProgress = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const courseData = {
        a: {
          label: "Course A",
          progress: 67,
          learningTime: 12.5,
          completedLessons: 50,
          totalLessons: 100,
          pendingLessons: 4,
          monthlyProgress: [
            { month: "Jan", score: 35 },
            { month: "Feb", score: 40 },
            { month: "Mar", score: 42 },
            { month: "Apr", score: 45 },
            { month: "May", score: 50 },
            { month: "Jun", score: 48 },
            { month: "Jul", score: 50 },
            { month: "Aug", score: 52 },
          ],
        },
        b: {
          label: "Course B",
          progress: 45,
          learningTime: 8.2,
          completedLessons: 30,
          totalLessons: 80,
          pendingLessons: 2,
          monthlyProgress: [
            { month: "Jan", score: 20 },
            { month: "Feb", score: 25 },
            { month: "Mar", score: 30 },
            { month: "Apr", score: 35 },
            { month: "May", score: 40 },
            { month: "Jun", score: 42 },
            { month: "Jul", score: 44 },
            { month: "Aug", score: 45 },
          ],
        },
      };

      if (courseId === "all") {
        const courses = Object.values(courseData);
        const numCourses = courses.length;
        const aggregated = {
          label: "Overall",
          progress: Math.round(
            courses.reduce((sum, c) => sum + c.progress, 0) / numCourses
          ),
          learningTime: courses
            .reduce((sum, c) => sum + c.learningTime, 0)
            .toFixed(1),
          completedLessons: courses.reduce(
            (sum, c) => sum + c.completedLessons,
            0
          ),
          totalLessons: courses.reduce((sum, c) => sum + c.totalLessons, 0),
          pendingLessons: courses.reduce((sum, c) => sum + c.pendingLessons, 0),
          monthlyProgress: courseData.a.monthlyProgress.map(
            (monthData, index) => ({
              month: monthData.month,
              score: Math.round(
                courses.reduce(
                  (sum, c) => sum + (c.monthlyProgress[index]?.score || 0),
                  0
                ) / numCourses
              ),
            })
          ),
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
      _id: "1",
      title: "Spanish Conversation",
      teacher: {
        fullName: "Mr. Carlos Rodriguez",
        profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.5,
        reviewCount: 52,
        subject: "Spanish",
      },
      durationInMinutes: 45,
      courseDetails: "Course A",
      lessonType: "Group",
      lessonMode: "Online Course",
      trialLesson: true,
      upcomingDateTime: "2h 0m",
      lessonTime: "08:20 AM",
      additionalTags: ["Trial Lessons"],
      location: "Online",
      description:
        "Quantum mechanics fundamentals and wave-particle duality concepts.",
    },
    {
      _id: "2",
      title: "Japanese Writing",
      teacher: {
        fullName: "Ms. Yuki Tanaka",
        profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 4.8,
        reviewCount: 75,
        subject: "Japanese",
      },
      durationInMinutes: 90,
      courseDetails: "Course B",
      lessonType: "Group",
      lessonMode: "Online Course",
      trialLesson: false,
      upcomingDateTime: "1d 0h",
      lessonTime: "06:20 AM",
      additionalTags: ["Curriculum-Aligned Games"],
      location: "19 Washington Square N, New York, NY 10011, USA",
      description:
        "Fundamentals of Japanese hiragana and katakana writing systems.",
    },
    {
      _id: "3",
      title: "English Literature",
      teacher: {
        fullName: "Ms. Sarah Johnson",
        profilePicture: "https://randomuser.me/api/portraits/women/78.jpg",
        rating: 5.0,
        reviewCount: 31,
        subject: "English",
      },
      durationInMinutes: 90,
      courseDetails: "Course C",
      lessonType: "1-on-1",
      lessonMode: "Online Course",
      trialLesson: false,
      upcomingDateTime: "31 Jul 2025",
      lessonTime: "06:20 AM",
      location: "Online",
      description:
        "An introductory class on classic English novels and poetry.",
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
    _id: "upcoming1",
    title: "Spanish Conversation",
    teacherName: "Mr. Carlos Rodriguez",
    teacherImage: "https://randomuser.me/api/portraits/men/32.jpg",
    duration: 45,
    course: "A",
    type: "Group",
    modality: "Online Course",
    tags: ["Trial Lessons"],
    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: "Upcoming",
  },
  {
    _id: "upcoming2",
    title: "Japanese Writing",
    teacherName: "Ms. Yuki Tanaka",
    teacherImage: "https://randomuser.me/api/portraits/women/44.jpg",
    duration: 90,
    course: "B",
    type: "Group",
    modality: "Online Course",
    tags: ["Curriculum-Aligned Games"],
    startTime: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(), // 1 day + 1 hour from now
    status: "Upcoming",
  },
  {
    _id: "upcoming3",
    title: "English Literature",
    teacherName: "Ms. Sarah Johnson",
    teacherImage: "https://randomuser.me/api/portraits/women/68.jpg",
    duration: 90,
    course: "C",
    type: "1-on-1",
    modality: "Online Course",
    tags: [],
    startTime: new Date(2025, 6, 31, 6, 20, 0).toISOString(), // July 31, 2025
    status: "Upcoming",
  },
];

export const historyLessons = [
  {
    _id: "history1",
    title: "Spanish Conversation",
    teacherName: "Mr. Carlos Rodriguez",
    teacherImage: "https://randomuser.me/api/portraits/men/32.jpg",
    duration: 45,
    course: "A",
    type: "Group",
    modality: "Online Course",
    tags: ["Trial Lessons"],
    startTime: new Date(2025, 6, 31, 8, 20, 0).toISOString(), // July 31, 2025
    status: "Completed",
  },
  {
    _id: "history2",
    title: "Japanese Writing",
    teacherName: "Ms. Yuki Tanaka",
    teacherImage: "https://randomuser.me/api/portraits/women/44.jpg",
    duration: 90,
    course: "B",
    type: "Group",
    modality: "Online Course",
    tags: ["Curriculum-Aligned Games"],
    startTime: new Date(2025, 6, 25, 6, 20, 0).toISOString(), // July 25, 2025
    status: "Cancelled",
  },
  {
    _id: "history3",
    title: "English Literature",
    teacherName: "Ms. Sarah Johnson",
    teacherImage: "https://randomuser.me/api/portraits/women/68.jpg",
    duration: 90,
    course: "C",
    type: "1-on-1",
    modality: "Online Course",
    tags: [],
    startTime: new Date(2025, 6, 18, 8, 20, 0).toISOString(), // July 18, 2025
    status: "Completed",
  },
];

export const mockTeachers = [
  {
    id: "teacher-001",
    name: "María García",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-002",
    name: "Pierre Dubois",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "Paris, France",
    rating: 4.8,
    reviewCount: 98,
    hourlyRate: 32,
    languages: ["French", "English"],
    experience: 7,
    studentCount: 110,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Structured and methodical",
    availability: ["Weekdays", "Mornings"],
    specialties: ["French Grammar", "Conversation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-003",
    name: "Sarah Martinez",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "English, Spanish & French Teacher",
    location: "New York, USA",
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 45,
    languages: ["English", "Spanish", "French"],
    experience: 8,
    studentCount: 245,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Morning", "Evenings", "Weekend"],
    specialties: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-004",
    name: "Sarah Martinez",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    profileImage: "/assets/images/teacher-profile.jpg", // Use local asset
    languages: ["English", "Spanish", "French"],
    rating: 4.8,
    reviewCount: 127,
    isOnline: true,
    isVerified: true,
    experience: 8,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
    title: "English, Spanish",
    location: "",
    hourlyRate: 0,
    studentCount: 0,
    teachingStyle: "",
    availability: [],
    specialties: [],
    isFavorited: false,
  },
  {
    id: "teacher-005",
    name: "María García5",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-006",
    name: "Pierre Dubois6",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-007",
    name: "María García7",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-008",
    name: "Pierre Dubois8",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-009",
    name: "María García9",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-010",
    name: "Pierre Dubois10",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-011",
    name: "María García11",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-012",
    name: "Pierre Dubois12",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-013",
    name: "María García13",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-014",
    name: "Pierre Dubois14",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-015",
    name: "María García15",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-016",
    name: "Pierre Dubois16",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-017",
    name: "María García17",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-018",
    name: "Pierre Dubois18",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-019",
    name: "María García19",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-020",
    name: "Pierre Dubois20",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-021",
    name: "María García21",
    schoolSlug: "sunrise-academy",
    schoolName: "Sunrise Academy",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "Native Spanish Teacher & Cultural Expert",
    location: "San Francisco, USA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 25,
    languages: ["Spanish", "English"],
    experience: 8,
    studentCount: 156,
    isVerified: true,
    isOnline: true,
    teachingStyle: "Interactive and conversational",
    availability: ["Weekdays", "Evenings"],
    specialties: ["Beginner Spanish", "Grammar", "Conversation"],
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    isFavorited: false,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
  {
    id: "teacher-022",
    name: "Pierre Dubois22",
    schoolSlug: "paris-language-center",
    schoolName: "Paris Language Center",
    schoolLogo: "https://via.placeholder.com/80x80.png?text=Sunrise",
    title: "French Language Specialist",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 30,
    languages: ["French", "English"],
    experience: 6,
    studentCount: 98,
    isVerified: true,
    isOnline: false,
    teachingStyle: "Structured and methodical",
    availability: ["Weekends", "Mornings"],
    specialties: ["French Grammar", "Pronunciation", "Literature"],
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isFavorited: true,
    bio: `I'm a passionate language educator with over 8 years of experience teaching English, Spanish, and French to students of all ages. My teaching philosophy centers on creating an engaging, supportive environment where students feel confident to practice and make mistakes as part of their learning journey.\n\nI hold a Master's degree in Applied Linguistics and am certified in TESOL/TEFL. I've worked with students from diverse cultural backgrounds, helping them achieve their language goals whether for academic purposes, career advancement, or personal enrichment.\n\nMy courses are interactive and tailored to each student's learning style and objectives. I believe in using real-world materials and practical scenarios to make language learning both effective and enjoyable.`,
    certificates: [
      {
        name: "Master's in Applied Linguistics",
        issuer: "University of California, Berkeley",
        year: "2016",
        verified: true,
      },
      {
        name: "TESOL Certification",
        issuer: "International TESOL Association",
        year: "2015",
        verified: true,
      },
      {
        name: "DELE Spanish Proficiency Certificate",
        issuer: "Instituto Cervantes",
        year: "2014",
        verified: true,
      },
    ],
    ageGroups: [
      "Children (6-12)",
      "Teenagers (13-17)",
      "Adults (18+)",
      "Seniors (65+)",
    ],
    teachingExperience: [
      {
        position: "Senior Language Instructor",
        institution: "International Language Academy",
        duration: "2019 - Present",
        description:
          "Teaching advanced English and Spanish courses to international students",
      },
      {
        position: "Online Language Tutor",
        institution: "Global Learning Platform",
        duration: "2017 - 2019",
        description:
          "Conducted 1-on-1 and group sessions for students worldwide",
      },
      {
        position: "ESL Teacher",
        institution: "Community College District",
        duration: "2015 - 2017",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    specializations: [
      "Conversational Practice",
      "Business English",
      "Academic Writing",
      "Pronunciation Training",
      "Grammar Fundamentals",
      "Cultural Communication",
    ],
  },
];

export const mockClasses = [
  {
    id: "class-001",
    teacherId: "teacher-003", // Sarah Martinez teaches this class
    title: "Conversational English Mastery",
    description:
      "Improve your speaking confidence through engaging conversations about daily topics, current events, and personal interests.",
    type: "1-on-1",
    duration: 60,
    price: 45,
    schedule: { flexible: true },
  },
  {
    id: "class-002",
    teacherId: "teacher-003", // Sarah Martinez teaches this class
    title: "Business English Essentials",
    description:
      "Master professional communication skills including presentations, meetings, emails, and networking.",
    type: "1-on-1",
    duration: 90,
    price: 65,
    schedule: { flexible: true },
  },
  {
    id: "class-003",
    teacherId: "teacher-001", // María García teaches this class
    title: "Spanish for Beginners Group",
    description:
      "Start your Spanish journey with basic vocabulary, grammar, and pronunciation in a supportive group environment.",
    type: "Group",
    duration: 75,
    price: 25,
    maxStudents: 8,
    enrolledStudents: 6,
    location: "Downtown Learning Center, Room 204",
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "6:00 PM - 7:15 PM",
    },
    nextSession: "Monday, January 8th at 6:00 PM",
  },
  {
    id: "class-004",
    teacherId: "teacher-002", // Pierre Dubois teaches this class
    title: "French Conversation Circle",
    description:
      "Practice French speaking skills in a relaxed group setting with fellow learners. All levels welcome.",
    type: "Group",
    duration: 60,
    price: 20,
    maxStudents: 10,
    enrolledStudents: 8,
    location: "Language Lab, Building A",
    schedule: { days: ["Tuesday", "Thursday"], time: "7:00 PM - 8:00 PM" },
    nextSession: "Tuesday, January 9th at 7:00 PM",
  },
  {
    id: "class-005",
    teacherId: "teacher-003", // Sarah Martinez teaches this class
    title: "Academic Writing Workshop",
    description:
      "Develop strong academic writing skills for essays, research papers, and thesis work. Includes feedback and revision techniques.",
    type: "1-on-1",
    duration: 120,
    price: 80,
    schedule: { flexible: true },
  },
];

export const mockReviews = [
  {
    id: "review-001",
    teacherId: "teacher-003", // Review for Sarah Martinez
    classId: "class-001", // Review for Conversational English Mastery
    studentName: "Michael Chen",
    studentAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2025-01-02",
    comment:
      "Sarah is an exceptional teacher! Her conversational English classes have dramatically improved my confidence.",
    verified: true,
    helpfulCount: 12,
    className: "Pronunciation Bootcamp",
    classType: "Group",
  },
  {
    id: "review-002",
    teacherId: "teacher-001", // Review for María García
    classId: "class-003", // Review for Spanish for Beginners Group
    studentName: "Emma Rodriguez",
    studentAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2024-12-28",
    comment:
      "The Spanish beginners group is fantastic! María makes learning fun and interactive.",
    verified: true,
    helpfulCount: 8,
    className: "Pronunciation Bootcamp",
    classType: "Group",
  },
  {
    id: "review-003",
    teacherId: "teacher-003", // Review for Sarah Martinez
    classId: "class-002", // Review for Business English Essentials
    studentName: "David Kim",
    studentAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "2024-12-25",
    comment:
      "Great business English sessions. Practical examples and improved presentation skills.",
    verified: true,
    helpfulCount: 6,
    className: "Pronunciation Bootcamp",
    classType: "Group",
  },
  {
    id: "review-004",
    teacherId: "teacher-002", // Review for Pierre Dubois
    classId: "class-004", // Review for French Conversation Circle
    studentName: "Lisa Thompson",
    studentAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2024-12-20",
    comment:
      "The French conversation circle is exactly what I needed! My speaking confidence has grown tremendously.",
    verified: true,
    helpfulCount: 9,
    className: "Pronunciation Bootcamp",
    classType: "Group",
  },
  {
    id: "review-005",
    teacherId: "teacher-003", // Review for Sarah Martinez
    classId: "class-005", // Review for Academic Writing Workshop
    studentName: "James Wilson",
    studentAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    date: "2024-12-15",
    comment:
      "Sarah's academic writing workshop was a game-changer for my thesis. Detailed feedback and improvement guidance.",
    verified: true,
    helpfulCount: 15,
    className: "Pronunciation Bootcamp",
    classType: "Group",
  },
  {
    id: "review-006",
    teacherId: "teacher-003", // Review for Sarah Martinez
    classId: "class-005", // Review for Academic Writing Workshop
    studentName: "Maria Gonzalez",
    studentAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    date: "2024-12-10",
    comment:
      "The pronunciation bootcamp was intensive but very effective. Sarah has a great ear for pronunciation issues and provides specific techniques to improve. Wish it was longer!",
    className: "Pronunciation Bootcamp",
    classType: "Group",
    verified: true,
    helpfulCount: 7,
  },
];
