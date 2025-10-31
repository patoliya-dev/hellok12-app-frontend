import { createSlice, isAnyOf } from '@reduxjs/toolkit';

// === TRACK THE THUNKS USED BY THESE PAGES ===
// Adjust the imports below to match your repo names exactly.
import {
    // Course/Lesson list/detail
    fetchCourses as fetchCoursesThunk,
    fetchCourse as fetchCourseThunk,
    fetchCourseWithLessons as fetchCourseWithLessonsThunk
} from '../../reducers/courses/courseThunks';

const trackedPending = [
    fetchCourseThunk.pending,
    fetchCoursesThunk.pending,
    fetchCourseWithLessonsThunk.pending,
].filter(Boolean);

const trackedSettled = [
    fetchCourseThunk.fulfilled, fetchCourseThunk.rejected,
    fetchCoursesThunk.fulfilled, fetchCoursesThunk.rejected,
    fetchCourseWithLessonsThunk.fulfilled, fetchCourseWithLessonsThunk.rejected,
].filter(Boolean);

const pageLoaderSlice = createSlice({
    name: 'pageLoader',
    initialState: { inFlight: 0 },
    reducers: {
        begin(state) { state.inFlight += 1; },
        end(state) { state.inFlight = Math.max(0, state.inFlight - 1); },
        reset(state) { state.inFlight = 0; }
    },
    extraReducers: (b) => {
        if (trackedPending.length) {
            b.addMatcher(isAnyOf(...trackedPending), (s) => { s.inFlight += 1; });
        }
        if (trackedSettled.length) {
            b.addMatcher(isAnyOf(...trackedSettled), (s) => { s.inFlight = Math.max(0, s.inFlight - 1); });
        }
    }
});

export const { begin, end, reset } = pageLoaderSlice.actions;
export const selectPageLoading = (s) => s.pageLoader.inFlight > 0;
export default pageLoaderSlice.reducer;
