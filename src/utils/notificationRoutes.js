export function resolveNotificationDeepLink(
  notification,
  userRole = "student",
) {
  const explicit = notification?.metadata?.deepLink;
  if (explicit && typeof explicit === "object" && explicit.route) {
    return explicit.route;
  }
  if (typeof explicit === "string" && explicit.trim()) {
    return explicit;
  }

  const role = String(userRole || "student").toLowerCase();
  const base = role === "super_admin" ? "/admin" : `/${role}`;

  if (notification?.type?.startsWith("LESSON")) {
    return `${base}/lessons`;
  }

  if (notification?.type === "COURSE_UPDATED") {
    if (role === "teacher" || role === "school")
      return `${base}/manage-courses`;
    return `${base}/lessons`;
  }

  if (
    notification?.type?.includes("PAYMENT") ||
    notification?.type === "COURSE_PURCHASED"
  ) {
    if (["student", "parent"].includes(role)) {
      return `${base}/payment-billing`;
    }
    if (role === "teacher") {
      return `${base}/earnings`;
    }
    return `${base}/notifications`;
  }

  if (
    notification?.type?.includes("INVITATION") ||
    notification?.type?.includes("TEACHER")
  ) {
    if (role === "school") {
      return `${base}/manage-teachers`;
    }
    if (role === "super_admin") {
      return "/admin/teachers";
    }
  }

  if (notification?.type === "SCHOOL_CUSTOM_MESSAGE") {
    if (role === "teacher") return `${base}/profile-settings`;
    return `${base}/notifications`;
  }

  return `${base}/notifications`;
}
