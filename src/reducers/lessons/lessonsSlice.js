import { createSlice } from '@reduxjs/toolkit';
import { fetchLessonsByCourse, fetchLesson, createLessons, updateLesson, removeLesson } from './lessonThunks';

const initByCourse = {};
const initDetail = { byId: {}, loading: false, error: null };

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: { byCourse: initByCourse, detail: initDetail },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchLessonsByCourse.pending, (s, a) => {
       const id = a.meta.arg.courseId;
       s.byCourse[id] ??= { items: [], pagination: { page:1, limit:50, total:0, pages:0 }, loading:false, error:null, filters:{ page:1, limit:50 } };
       s.byCourse[id].loading = true; s.byCourse[id].error = null;
     })
     .addCase(fetchLessonsByCourse.fulfilled, (s, { payload }) => {
       const { courseId, payload: data, filters } = payload;
       s.byCourse[courseId] = { items: data.items, pagination: data.pagination, loading:false, error:null, filters };
     })
     .addCase(fetchLessonsByCourse.rejected, (s, { meta, payload }) => {
       const id = meta.arg.courseId;
       s.byCourse[id].loading = false;
       s.byCourse[id].error = payload?.message || 'Failed to load lessons';
     })
     .addCase(fetchLesson.pending, (s)=>{ s.detail.loading = true; s.detail.error = null; })
     .addCase(fetchLesson.fulfilled, (s,{payload})=>{ s.detail.loading=false; s.detail.byId[payload._id]=payload; })
     .addCase(fetchLesson.rejected, (s,{payload})=>{ s.detail.loading=false; s.detail.error = payload?.message || 'Failed to load lesson'; })
     .addCase(updateLesson.fulfilled, (s,{payload})=>{ s.detail.byId[payload._id]=payload; })
     .addCase(createLessons.fulfilled, ()=>{})
     .addCase(removeLesson.fulfilled, ()=>{});
  }
});

export default lessonsSlice.reducer;
