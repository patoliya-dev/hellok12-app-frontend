import { createSlice } from '@reduxjs/toolkit';
import { presignAttachment, uploadToS3, completeAttachment } from './attachmentThunks';

const slice = createSlice({
  name: 'attachments',
  initialState: { inFlight: false, error: null, last: null },
  reducers: { resetAttachmentState(s) { s.inFlight = false; s.error = null; s.last = null; } },
  extraReducers: (b) => {
    b.addCase(presignAttachment.pending, (s)=>{ s.inFlight = true; s.error = null; })
     .addCase(presignAttachment.fulfilled, (s)=>{ s.inFlight = false; })
     .addCase(presignAttachment.rejected, (s,a)=>{ s.inFlight = false; s.error = a.payload?.message || 'Presign failed'; })
     .addCase(uploadToS3.pending, (s)=>{ s.inFlight = true; s.error = null; })
     .addCase(uploadToS3.fulfilled, (s)=>{ s.inFlight = false; })
     .addCase(uploadToS3.rejected, (s,a)=>{ s.inFlight = false; s.error = a.payload?.message || 'Upload failed'; })
     .addCase(completeAttachment.pending, (s)=>{ s.inFlight = true; s.error = null; })
     .addCase(completeAttachment.fulfilled, (s,a)=>{ s.inFlight = false; s.last = a.payload; })
     .addCase(completeAttachment.rejected, (s,a)=>{ s.inFlight = false; s.error = a.payload?.message || 'Complete failed'; });
  }
});

export const { resetAttachmentState } = slice.actions;
export default slice.reducer;
