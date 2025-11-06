// Teacher search service
// Builds query string from search and filter options and calls the backend

import api from "../utils/axiosInstance";
import { qs } from "../utils/utils";

function mapToQueryObject({ q, filters = {}, page, limit } = {}) {
  const query = {};
  if (q) query.q = q;

  // Central mapping of UI filters -> backend params
  if (filters.school) query.school = filters.school;
  if (filters.languages) query.language = filters.languages;
  if (filters.experience) query.experience = filters.experience;
  if (filters.availability) query.availability = filters.availability;
  if (filters.ageRange) query.ageRange = filters.ageRange;
  if (filters.rating) query.rating = filters.rating;
  if (filters.onlineStatus) query.onlineStatus = filters.onlineStatus;
  if (filters.lessonType) query.lessonType = filters.lessonType;
  if (filters.price) query.price = filters.price;

  if (page != null) query.page = page;
  if (limit != null) query.limit = limit;

  return query;
}

export async function fetchTeachers({ q, filters, page, limit } = {}) {
  const queryObj = mapToQueryObject({ q, filters, page, limit });
  const query = qs(queryObj);
  const url = `/find-teachers?${query}`;

  const response = await api.get(url);

  return response.data.data;
}

export default {
  fetchTeachers,
};
