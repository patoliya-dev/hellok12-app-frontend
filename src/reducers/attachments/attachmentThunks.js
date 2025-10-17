import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './attachmentApi';
import { normalizeErr } from '../../features/shared/apiTypes';

/**
 * Step-1: Ask BE for presign
 */
export const presignAttachment = createAsyncThunk(
  'attachments/presign',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.initUpload(payload);
      if (!data?.success) return rejectWithValue(data);
      return data.data || data; // support {data} or plain
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

/**
 * Step-2: Upload to S3 (POST fields or PUT single URL)
 * We do the browser upload here so components can await one thunk.
 */
export const uploadToS3 = createAsyncThunk(
  'attachments/uploadToS3',
  async ({ upload, file, onProgress }, { rejectWithValue }) => {
    try {

      if (upload?.fields && upload?.url) {
        await new Promise((resolve, reject) => {
          const form = new FormData();
          // append presigned fields verbatim (order matters)
          Object.entries(upload.fields).forEach(([k, v]) => form.append(k, String(v)));
          // file MUST be last
          form.append('file', file);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', upload.url, true);

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable && typeof onProgress === 'function') {
              const pct = Math.round((evt.loaded / evt.total) * 100);
              onProgress(pct);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(true);
            else reject(new Error(`S3 upload failed ${xhr.status}: ${xhr.responseText || xhr.statusText}`));
          };

          xhr.onerror = () => reject(new Error('Network error during S3 upload'));
          xhr.send(form);
        });

        return { ok: true };
      }

      // Presigned PUT (rare in your flow, still supported)
      if (upload?.uploadUrl) {
        // Note: fetch PUT cannot give progress; if you need it, switch to XHR here too
        const res = await fetch(upload.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });
        if (!res.ok) throw new Error(`S3 PUT failed: ${res.status}`);
        if (typeof onProgress === 'function') onProgress(100);
        return { ok: true };
      }

      throw new Error('Invalid upload payload');
    } catch (err) {
      return rejectWithValue({ code: 'UPLOAD_FAILED', message: err.message });
    }
  }
);

/**
 * Step-3: Finalize in BE
 */
export const completeAttachment = createAsyncThunk(
  'attachments/complete',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.completeUpload(payload || {});
      if (!data?.success) return rejectWithValue(data);
      return data.data || data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const claimAttachment = createAsyncThunk(
  "attachments/claim",
  async ({ attachmentId, entityType, entityId, moveToEntityPrefix = true, scope = "intro" }, { rejectWithValue }) => {
    try {
      const { data } = await api.claimAttachment(attachmentId, {
        entityType,
        entityId,
        moveToEntityPrefix,
        scope,
      });
      // BE uses { success, message, data, statusCode }
      if (!data?.success) return rejectWithValue(data);
      return data.data; // the updated attachment object
    } catch (err) {
      const resp = err?.response?.data || { message: "Attachment claim failed" };
      return rejectWithValue(resp);
    }
  }
);
