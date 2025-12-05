import { createSlice } from "@reduxjs/toolkit";
import {
  presignAttachment,
  uploadToS3,
  completeAttachment,
  updateAttachment,
  deleteAttachment,
  uploadAttachmentFlow,
} from "./attachmentThunks";

const slice = createSlice({
  name: "attachments",
  initialState: { inFlight: false, error: null, last: null },
  reducers: {
    resetAttachmentState(s) {
      s.inFlight = false;
      s.error = null;
      s.last = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(presignAttachment.pending, (s) => {
      s.inFlight = true;
      s.error = null;
    })
      .addCase(presignAttachment.fulfilled, (s) => {
        s.inFlight = false;
      })
      .addCase(presignAttachment.rejected, (s, a) => {
        s.inFlight = false;
        s.error = a.payload?.message || "Presign failed";
      })
      .addCase(uploadToS3.pending, (s) => {
        s.inFlight = true;
        s.error = null;
      })
      .addCase(uploadToS3.fulfilled, (s) => {
        s.inFlight = false;
      })
      .addCase(uploadToS3.rejected, (s, a) => {
        s.inFlight = false;
        s.error = a.payload?.message || "Upload failed";
      })
      .addCase(completeAttachment.pending, (s) => {
        s.inFlight = true;
        s.error = null;
      })
      .addCase(completeAttachment.fulfilled, (s, a) => {
        s.inFlight = false;
        s.last = a.payload;
      })
      .addCase(completeAttachment.rejected, (s, a) => {
        s.inFlight = false;
        s.error = a.payload?.message || "Complete failed";
      })
      .addCase(updateAttachment.pending, (s) => {
        s.inFlight = true;
        s.error = null;
      })
      .addCase(updateAttachment.fulfilled, (s, a) => {
        s.inFlight = false;
        s.last = a.payload;
      })
      .addCase(updateAttachment.rejected, (s, a) => {
        s.inFlight = false;
        s.error = a.payload?.message || "Update failed";
      })
      // Delete attachment
      .addCase(deleteAttachment.pending, (s) => {
        s.inFlight = true;
        s.error = null;
      })
      .addCase(deleteAttachment.fulfilled, (s) => {
        s.inFlight = false;
        s.last = null;
      })
      .addCase(deleteAttachment.rejected, (s, a) => {
        s.inFlight = false;
        s.error = a.payload?.message || "Delete failed";
      })
      .addCase(uploadAttachmentFlow.pending, (s) => {
        s.inFlight = true;
        s.error = null;
        s.uploadProgress = 0;
      })
      .addCase(uploadAttachmentFlow.fulfilled, (s, a) => {
        s.inFlight = false;
        s.last = a.payload;
        s.uploadProgress = 100;
      })
      .addCase(uploadAttachmentFlow.rejected, (s, a) => {
        s.inFlight = false;
        s.error = a.payload?.message || "Upload flow failed";
        s.uploadProgress = 0;
      });
  },
});

export const { resetAttachmentState } = slice.actions;
export default slice.reducer;
