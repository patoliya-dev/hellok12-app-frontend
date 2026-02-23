import React, { useEffect, useRef, useState } from "react";
import { cloneDeep, set } from "lodash";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import { errorToast, successToast } from "../../../../utils/utils";
import { useDispatch } from "react-redux";
import {
  deleteAttachment,
  uploadAttachmentFlow,
} from "reducers/attachments/attachmentThunks";

const flatInputClassName =
  "h-10 rounded-md border border-border bg-muted/40 focus-visible:ring-primary";

const getAddressList = (profile = {}) => {
  const fromArray = Array.isArray(profile.addresses) ? profile.addresses : [];
  if (fromArray.length > 0) {
    return fromArray.map((x) => (x ?? "").toString());
  }

  return [profile.address1, profile.address2]
    .map((x) => (x ?? "").toString());
};

const normalizeInitialAddresses = (profile = {}) => {
  const base = getAddressList(profile);
  let lastNonEmptyIndex = -1;

  for (let i = 0; i < base.length; i += 1) {
    if ((base[i] || "").trim()) {
      lastNonEmptyIndex = i;
    }
  }

  if (lastNonEmptyIndex === -1) return [""];
  return base.slice(0, lastNonEmptyIndex + 1);
};

const SchoolProfileSection = ({
  profileData,
  onSave,
  onChangePasswordClick,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState({
    type: "init",
    file: null,
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [formData, setFormData] = useState(profileData || {});
  const latestProfileData = useRef(profileData || {});

  useEffect(() => {
    const source = profileData || {};
    const normalized = {
      ...source,
      profile: {
        ...(source.profile || {}),
        addresses: normalizeInitialAddresses(source.profile || {}),
      },
    };
    setFormData(normalized);
    setLogoPreview(source?.profileImage?.url || "");
    latestProfileData.current = normalized;
    setIsEditing(false);
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = cloneDeep(prev);
      set(updated, name, value);
      return updated;
    });
  };

  const handleAddressChange = (index, value) => {
    setFormData((prev) => {
      const updated = cloneDeep(prev);
      const list = Array.isArray(updated?.profile?.addresses)
        ? [...updated.profile.addresses]
        : [];
      list[index] = value;
      updated.profile = { ...(updated.profile || {}), addresses: list };
      return updated;
    });
  };

  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        addresses: [...(prev.profile?.addresses || []), ""],
      },
    }));
  };

  const removeAddress = (index) => {
    setFormData((prev) => {
      const updated = cloneDeep(prev);
      const list = [...(updated?.profile?.addresses || [])];
      list.splice(index, 1);
      updated.profile = { ...(updated.profile || {}), addresses: list };
      return updated;
    });
  };

  const handleLogoUpload = (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result || "");
      setSelectedImageFile({ type: "upload", file });
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    setLogoPreview("");
    if (!formData?.profileImage?._id) {
      setSelectedImageFile({ type: "init", file: null });
      return;
    }
    setSelectedImageFile({ type: "delete", file: null });
  };

  const copyTeachersDisplayLink = async () => {
    const link = formData?.profile?.teachersDisplayLink || "";
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      successToast("Link copied");
    } catch (err) {
      errorToast("Unable to copy link");
    }
  };

  const normalizePayload = (payload) => {
    const addresses = (payload?.profile?.addresses || [])
      .map((x) => (x || "").trim())
      .filter(Boolean);

    return {
      ...payload,
      profile: {
        ...(payload?.profile || {}),
        addresses,
        address1: addresses[0] || "",
        address2: addresses[1] || "",
      },
    };
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const normalizedPayload = normalizePayload(formData);

      if (selectedImageFile?.type === "delete") {
        if (formData?.profileImage?._id) {
          await dispatch(deleteAttachment(formData.profileImage._id)).unwrap();
        }
        await onSave(normalizedPayload);
        successToast("Profile updated successfully");
        setSelectedImageFile({ type: "init", file: null });
        setIsEditing(false);
        return;
      }

      if (selectedImageFile?.type === "upload" && selectedImageFile?.file) {
        const existingAttachmentId =
          formData?.profileImage?._id ||
          formData?.profile?.profileImageAttachmentId;

        await dispatch(
          uploadAttachmentFlow({
            file: selectedImageFile.file,
            entityType: "User",
            entityId: formData?.id,
            existingAttachmentId,
          }),
        ).unwrap();
      }

      await onSave(normalizedPayload);
      successToast("Profile updated successfully");
      setSelectedImageFile({ type: "init", file: null });
      setIsEditing(false);
    } catch (err) {
      errorToast(err?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(latestProfileData.current);
    setLogoPreview(latestProfileData.current?.profileImage?.url || "");
    setSelectedImageFile({ type: "init", file: null });
    setIsEditing(false);
  };

  return (
    <section className="w-full mb-5 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center gap-2 p-4 md:p-5">
          <Icon name="User" size={16} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            School Information
          </h2>
        </div>
        <div className="px-6 pb-5 md:px-6 md:pb-6">
          <div className="flex items-start justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Manage school information and profile details
            </p>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                onClick={() => setIsEditing(true)}
                className="h-8 px-2 text-sm text-foreground"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  loading={isSaving}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-2">School Logo</p>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full border-2 border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="School logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="School" size={34} className="text-muted-foreground" />
                )}
              </div>

              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    iconName="Upload"
                  >
                    Upload Logo
                  </Button>
                  {logoPreview && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-error"
                      onClick={handleLogoRemove}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="School Name"
              name="profile.schoolName"
              value={formData?.profile?.schoolName || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={flatInputClassName}
            />
            <Input
              label="Admin Full Name"
              name="name"
              value={formData?.name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={flatInputClassName}
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData?.phone || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={flatInputClassName}
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={flatInputClassName}
            />

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Password
              </label>
              <div className="h-10 rounded-md border border-border bg-muted/40 px-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">••••••••••••</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={onChangePasswordClick}
                  className="h-auto px-0"
                >
                  Change Password
                </Button>
              </div>
            </div>

            <Input
              label="Website"
              name="profile.website"
              value={formData?.profile?.website || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={flatInputClassName}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-foreground block mb-2">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              name="profile.description"
              value={formData?.profile?.description || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              placeholder="Enter your description"
              className={`w-full min-h-[86px] rounded-md border border-border px-3 py-2 text-sm bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring ${
                !isEditing ? "cursor-default" : ""
              }`}
            />
          </div>

          <div className="mt-4">
            <Input
              label="School Teacher Booking Display Link"
              name="profile.teachersDisplayLink"
              value={formData?.profile?.teachersDisplayLink || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              placeholder="https://..."
              className={flatInputClassName}
              rightAdornment={
                <button
                  type="button"
                  onClick={copyTeachersDisplayLink}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy booking display link"
                >
                  <Icon name="Copy" size={14} />
                </button>
              }
            />
          </div>

          <div className="mt-4 space-y-3">
            {(formData?.profile?.addresses || []).map((address, index) => (
              <div key={`address-${index}`}>
                <Input
                  label={`Address ${index + 1}`}
                  value={address || ""}
                  onChange={(e) => handleAddressChange(index, e.target.value)}
                  readOnly={!isEditing}
                  placeholder={`Address ${index + 1}`}
                  className={flatInputClassName}
                  rightAdornment={
                    index > 0 ? (
                      <button
                        type="button"
                        onClick={() => isEditing && removeAddress(index)}
                        className={`transition-colors ${
                          isEditing
                            ? "text-error hover:text-error/80"
                            : "text-error/50 cursor-default"
                        }`}
                        aria-label={`Delete address ${index + 1}`}
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    ) : null
                  }
                />
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                variant="default"
                size="xs"
                iconName="Plus"
                onClick={addAddress}
                disabled={!isEditing}
                className="h-7 px-3"
              >
                Add New Address
              </Button>
            </div>
          </div>
        </div>
      
    </section>
  );
};

export default SchoolProfileSection;
