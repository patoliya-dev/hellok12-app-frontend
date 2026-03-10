/**
 * Utility function to get role-based paths
 * @param {string} role - The user role ('student' or 'parent')
 * @param {string} path - The path without role prefix (e.g., 'dashboard', 'find-teacher')
 * @returns {string} - The full role-based path (e.g., '/student/dashboard')
 */
export const getRolePath = (role, path) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${role}${normalizedPath}`;
};
