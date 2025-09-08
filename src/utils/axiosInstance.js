import axios from 'axios';
import { getAccessToken, setAccessToken, clearAuthStorage } from './storage';

// base URL from env
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // if refresh token is in httpOnly cookie
  headers: { 'Content-Type': 'application/json' },
});

// attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// refresh flow
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);

    // if 401 and not retrying already -> try refresh
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((error) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call refresh endpoint — backend should return new access token
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = refreshResponse.data?.accessToken;
        setAccessToken(newToken);
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAuthStorage();
        // optional: redirect to login - but avoid doing it here (let components handle)
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
