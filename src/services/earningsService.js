import api from "../utils/axiosInstance";

/**
 * Fetch earnings summary data
 * @returns {Promise} Promise resolving to earnings summary data
 */
export async function fetchEarningsSummary() {
  const response = await api.get("/earnings/summary");
  return response.data.data;
}

/**
 * Fetch earnings trend data
 * @param {string} period - The period for the trend data (weekly, monthly, or yearly)
 * @returns {Promise} Promise resolving to earnings trend data
 */
export async function fetchEarningsTrend(period) {
  const response = await api.get("/earnings/trend", {
    params: { period },
  });
  return response.data.data;
}

/**
 * Fetch earnings list with filters
 * @param {Object} filters - Filter parameters for earnings list
 * @returns {Promise} Promise resolving to earnings list data and pagination
 */
export async function fetchEarningsList(filters = {}) {
  const response = await api.get("/earnings/list", {
    params: filters,
  });
  return response.data;
}

export default {
  fetchEarningsSummary,
  fetchEarningsTrend,
  fetchEarningsList,
};
