import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  signupUser,
  verifyEmail,
  refreshToken,
  logoutUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from './authThunks';

import { setAccessToken, setCurrentUser, getCurrentUser, getAccessToken, clearAuthStorage } from '../../utils/storage';

const initialState = {
  user: getCurrentUser(),
  accessToken: getAccessToken(),
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  forgotStatus: 'idle',
  forgotError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // client-only logout (no backend)
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;
      clearAuthStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const payload = action.payload || {};
        state.user = payload.user ?? state.user;
        state.accessToken = payload.accessToken ?? state.accessToken;
        state.error = null;

        if (payload.accessToken) setAccessToken(payload.accessToken);
        if (payload.user) setCurrentUser(payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Login failed';
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const payload = action.payload || {};
        state.user = payload.user ?? state.user;
        state.accessToken = payload.accessToken ?? state.accessToken;
        state.error = null;

        if (payload.accessToken) setAccessToken(payload.accessToken);
        if (payload.user) setCurrentUser(payload.user);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Signup failed';
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Refresh
      .addCase(refreshToken.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.accessToken = payload.accessToken ?? state.accessToken;
        if (payload.accessToken) setAccessToken(payload.accessToken);
        if (payload.user) {
          state.user = payload.user;
          setCurrentUser(payload.user);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        // failed refresh -> clear auth
        state.user = null;
        state.accessToken = null;
        clearAuthStorage();
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
        clearAuthStorage();
      })
      .addCase(logoutUser.rejected, (state) => {
        // even if server failed, clear client
        state.user = null;
        state.accessToken = null;
        state.status = 'idle';
        clearAuthStorage();
      })

      // forgot password flows (simple)
      .addCase(forgotPassword.pending, (state) => {
        state.forgotStatus = 'loading';
        state.forgotError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotStatus = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotStatus = 'failed';
        state.forgotError = action.payload || action.error?.message;
      })

      .addCase(verifyResetCode.pending, (state) => {
        state.forgotStatus = 'loading';
        state.forgotError = null;
      })
      .addCase(verifyResetCode.fulfilled, (state) => {
        state.forgotStatus = 'succeeded';
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.forgotStatus = 'failed';
        state.forgotError = action.payload || action.error?.message;
      })

      .addCase(resetPassword.pending, (state) => {
        state.forgotStatus = 'loading';
        state.forgotError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.forgotStatus = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.forgotStatus = 'failed';
        state.forgotError = action.payload || action.error?.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
