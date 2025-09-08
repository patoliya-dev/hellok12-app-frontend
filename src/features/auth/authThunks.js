import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosInstance';

// login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      return data; // expected { accessToken, user }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/signup', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/auth/verify-email?token=${token}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Verification failed");
    }
  }
);

// refresh (manual refresh call if needed)
export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/refresh', {}, { withCredentials: true });
      return data; // { accessToken, user? }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// logout (call backend to revoke refresh token if present)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // best-effort call; if no backend, remove client side state in reducer
      await api.post('/auth/logout');
      return true;
    } catch (err) {
      // still allow client to clear state
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// forgot password - send code
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/forgot-password', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// verify reset password code
export const verifyResetCode = createAsyncThunk(
  'auth/verifyResetCode',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/verify-reset-code', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/reset-password', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
