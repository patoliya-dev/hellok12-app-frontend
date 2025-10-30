export const uploadToS3 = async (file, presign) => {
  if (presign?.upload?.fields) {
    const form = new FormData();
    Object.entries(presign.upload.fields).forEach(([k, v]) =>
      form.append(k, v)
    );
    form.append("file", file);
    const res = await fetch(presign.upload.url, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("S3 upload failed (POST)");
    return { key: presign.key };
  }

  const putRes = await fetch(presign?.upload?.url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putRes.ok) throw new Error("S3 upload failed (PUT)");

  return { key: presign?.key };
};

/**
 * Generic helper to upload an attachment for any entity and update that entity concurrently.
 *
 * Params:
 * - file: File to upload
 * - entityType: e.g., "User" | "Student" | "Parent" | "Teacher" | "School"
 * - entityId: string | number
 * - existingAttachmentId: optional string if updating existing attachment
 * - apiClient: axios-like instance (configured with auth)
 * - onUpdateEntity: () => Promise (update call for the entity, receives key)
 * - presignExtra: optional object to include extra payload on presign
 *
 * Returns: { key }
 */
export const upsertAttachmentAndUpdateEntity = async ({
  file,
  entityType,
  entityId,
  existingAttachmentId,
  apiClient,
  onUpdateEntity,
  scope = "",
  presignExtra = {},
}) => {
  if (!file) throw new Error("No file provided");
  if (!entityType || !entityId) throw new Error("Missing entityType/entityId");
  if (!apiClient) throw new Error("Missing api client");
  if (!onUpdateEntity) throw new Error("Missing onUpdateEntity callback");

  // 1) Presign
  const presignResp = await apiClient.post(
    "/attachments/presign",
    {
      filename: file.name,
      mime: file.type,
      size: file.size,
      entityType,
      entityId,
      scope,
      ...presignExtra,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  const presign = presignResp?.data?.data || presignResp?.data;
  if (!presign?.upload?.url) throw new Error("No presign url returned");

  // 2) Upload
  const { key } = await uploadToS3(file, presign);
  if (!key) throw new Error("No S3 object key after upload");

  // 3) Attachment upsert and entity update concurrently
  const attachmentPromise = existingAttachmentId
    ? await apiClient.patch(`/attachments/update`, {
        key,
        attachmentId: existingAttachmentId,
      })
    : await apiClient.post("/attachments/complete", {
        key,
        entityType,
        entityId,
      });

  const attachmentData = attachmentPromise?.data?.data;
  const id = attachmentData?._id;

  await onUpdateEntity(key);

  return { key, id };
};
