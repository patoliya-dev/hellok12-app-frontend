const tabs = [
  { id: "personal", name: "Personal Info", icon: "User" },
  { id: "bio", name: "Bio & Specializations", icon: "FileText" },
  { id: "certifications", name: "Certifications", icon: "Award" },
  { id: "availability", name: "Availability", icon: "Calendar" },
  { id: "preferences", name: "Teaching Preferences", icon: "Settings" },
];

const daysOfWeek = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

const timeSlots = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese (Mandarin)" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "russian", label: "Russian" },
  { value: "hindi", label: "Hindi" },
];

const ageGroupOptions = [
  { value: "babies", label: "0 - 3 years old" },
  { value: "preschool", label: "4 - 5 years old" },
  { value: "elementary", label: "6 - 10 years old" },
  { value: "middle-school", label: "11 - 14 years old" },
  { value: "high-school", label: "15 -18 years old" },
  { value: "adults", label: "18+ years old" },
];

const timezoneOptions = [
  {
    value: "Pacific/Midway",
    label: "(UTC-12:00) International Date Line West",
  },
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  {
    value: "America/Los_Angeles",
    label: "(UTC-08:00) Pacific Time (US & Canada)",
  },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  {
    value: "America/New_York",
    label: "(UTC-05:00) Eastern Time (US & Canada)",
  },
  { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time (Canada)" },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "(UTC-03:00) Buenos Aires",
  },
  { value: "Atlantic/Azores", label: "(UTC-01:00) Azores" },
  { value: "Europe/London", label: "(UTC+00:00) London, Dublin, Edinburgh" },
  { value: "Europe/Berlin", label: "(UTC+01:00) Amsterdam, Berlin, Rome" },
  { value: "Europe/Istanbul", label: "(UTC+02:00) Athens, Istanbul, Cairo" },
  { value: "Asia/Riyadh", label: "(UTC+03:00) Moscow, Kuwait, Riyadh" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Abu Dhabi, Muscat" },
  { value: "Asia/Karachi", label: "(UTC+05:00) Islamabad, Karachi" },
  {
    value: "Asia/Kolkata",
    label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
  },
  { value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
  {
    value: "Asia/Shanghai",
    label: "(UTC+08:00) Beijing, Hong Kong, Singapore",
  },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Osaka, Sapporo, Tokyo" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney, Melbourne" },
  { value: "Pacific/Auckland", label: "(UTC+12:00) Auckland, Wellington" },
];

export {
  tabs,
  daysOfWeek,
  timeSlots,
  languageOptions,
  ageGroupOptions,
  timezoneOptions,
};
