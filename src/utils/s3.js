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

const handleSave = async () => {
  try {
    setIsSaving(true);

    if (!selectedImageFile) {
      await onSave(formData);
      successToast("Profile updated successfully");
      setIsEditing(false);
      return;
    }

    // Request presign URL
    const presignResp = await api.post(
      "/attachments/presign",
      {
        filename: selectedImageFile.name,
        mime: selectedImageFile.type,
        size: selectedImageFile.size,
        entityType: "User",
        entityId: formData.id,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    const presign = presignResp?.data?.data || presignResp?.data;
    if (!presign?.upload?.url) throw new Error("No presign url returned");

    // Upload to S3
    const { key } = await uploadToS3(selectedImageFile, presign);
    if (!key) throw new Error("No S3 object key after upload");

    // Check if already exists or not
    const existingAttachmentId =
      formData?.profileImage || formData?.profile?.profileImageAttachmentId;

    // Update attachment or create new
    const attachmentPromise = existingAttachmentId
      ? api.patch(`/attachments/${existingAttachmentId}`, { key })
      : api.post("/attachments/complete", {
          key,
          entityType: "User",
          entityId: formData.id,
        });

    // Update user
    const userPromise = onSave({ ...formData, profileImageKey: key });

    // Save changes
    await Promise.all([attachmentPromise, userPromise]);
    successToast("Profile updated successfully");
    setSelectedImageFile(null);
    setIsEditing(false);
  } catch (err) {
    console.error(err);
    errorToast(err?.message || "Failed to update profile");
  } finally {
    setIsSaving(false);
  }
};
