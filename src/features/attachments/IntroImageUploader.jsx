import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { presignAttachment, uploadToS3, completeAttachment } from '../../reducers/attachments/attachmentThunks';

export default function IntroImageUploader({ entityType='Course', entityId, onDone, disabled }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      // 1) presign
      const presignRes = await dispatch(presignAttachment({
        filename: file.name,
        mime: file.type,
        size: file.size,
        entityType, entityId, scope: 'intro'
      })).unwrap();

      const { key, upload } = presignRes; // aligns with your BE response

      // 2) upload to S3
      await dispatch(uploadToS3({ upload, file })).unwrap();

      // 3) complete
      const finalized = await dispatch(completeAttachment({ 
        "key": key,
        "entityType": entityType,
        // "entityId": entityId
       })).unwrap();

      // callback with id + url
      onDone && onDone({ attachmentId, url: finalized?.url || presignRes?.url });
    } catch (err) {
      console.error('Intro image upload failed:', err);
      alert(err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={onSelect} disabled={disabled || loading} />
      {preview && (
        <div className="rounded border p-2">
          <img src={preview} alt="intro preview" style={{ maxHeight: 120 }} />
        </div>
      )}
      {loading && <div className="text-sm text-gray-500">Uploading…</div>}
    </div>
  );
}
