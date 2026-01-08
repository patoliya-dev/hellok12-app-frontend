export const getDefaultRedirectForUser = (user) => {
  const role = user?.role;

  if (role === "school") return "/school/dashboard";
  if (role === "teacher") return "/teacher/dashboard";
  if (role === "student") return "/student/dashboard";
  if (role === "parent") return "/parent/dashboard";
  return "/";
};
