import api from "../utils/axiosInstance";

/**
 * Fetch earnings summary data.
 * Business rule: earnings come from paid purchases; payouts are exposed separately
 * (paidOut/availableBalance) and must not be merged into earnings totals.
 * @param {Object} params - Optional summary filters (range, from, to)
 * @returns {Promise} Promise resolving to earnings summary data
 */
export async function fetchEarningsSummary(params = {}) {
  const response = await api.get("/earnings/summary", {
    params,
  });
  return response.data.data;
}

/**
 * Fetch earnings trend data.
 * Uses `/earnings/graph` which buckets by purchase settlement date (paidAt fallback).
 * @param {string} period - The period for the trend data (weekly, monthly, or yearly)
 * @param {Object} params - Optional graph filters (from, to)
 * @returns {Promise} Promise resolving to earnings trend data
 */
export async function fetchEarningsTrend(period, params = {}) {
  const rangeMap = {
    weekly: "week",
    monthly: "month",
    yearly: "year",
  };

  const response = await api.get("/earnings/graph", {
    params: {
      range: rangeMap[period] || "month",
      ...params,
    },
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

/**
 * Fetch earnings commission/invoice data
 * @param {Object} filters - Filter parameters (startDate, endDate)
 * @returns {Promise} Promise resolving to earnings commission data
 */
export async function fetchEarningsCommission(filters = {}) {
  const response = await api.get("/earnings/earnings-commission", {
    params: filters,
  });
  return response.data;
}

export default {
  fetchEarningsSummary,
  fetchEarningsTrend,
  fetchEarningsList,
  fetchEarningsCommission,
};
