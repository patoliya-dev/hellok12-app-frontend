import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTotalUnreadCount } from "../../services/messages/message.service";

// Async thunk to fetch unread count
export const fetchUnreadCount = createAsyncThunk(
  "messages/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const count = await getTotalUnreadCount();
      return count;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Set unread count directly
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    // Increment/decrement unread count
    setUnreadMessageCount: (state, action) => {
      const { increment, decrement, refresh } = action.payload;

      if (increment) {
        state.unreadCount += increment;
      } else if (decrement) {
        state.unreadCount = Math.max(0, state.unreadCount - decrement);
      } else if (refresh) {
        // Trigger a refresh by setting loading state
        // The component will call fetchUnreadCount
        state.loading = true;
      }
    },

    // Reset unread count
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUnreadCount, setUnreadMessageCount, resetUnreadCount } =
  messagesSlice.actions;

// Selectors
export const selectUnreadCount = (state) => state.messages.unreadCount;

export default messagesSlice.reducer;
