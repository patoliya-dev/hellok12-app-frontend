import React, { useState, useEffect } from "react";
import Icon from "components/AppIcon";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import ProfileImageSection from "./ProfileImageSection";
import api from "../../../../utils/axiosInstance";
import set from "lodash/set";
import { upsertAttachmentAndUpdateEntity } from "../../../../utils/s3";
import { errorToast, successToast } from "../../../../utils/utils";

const ParentInfoSection = ({
  isExpanded,
  onToggle,
  profileData,
  onSave,
  onChangePasswordClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    setFormData(profileData);
    setIsEditing(false);
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev };
      set(updated, name, value);
      return updated;
    });
  };

  const handleStartEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setFormData(profileData);
    setIsEditing(false);
  };
  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);

      if (!selectedImageFile) {
        await onSave(formData);
        successToast("Profile updated successfully");
        setIsEditing(false);
        return;
      }

      const existingAttachmentId =
        formData?.profileImage?._id ||
        formData?.profile?.profileImageAttachmentId;

      await upsertAttachmentAndUpdateEntity({
        file: selectedImageFile,
        entityType: "User",
        entityId: formData.id,
        existingAttachmentId,
        apiClient: api,
        onUpdateEntity: async () => onSave({ ...formData }),
      });

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

  console.log(profileData?.profileImage?.url || profileData?.profileImage)

  return (
    <section className="w-full mb-5 bg-card border border-border rounded-lg shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="UserCircle" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Parent Information
          </h2>
        </div>
        <Icon
          name="ChevronDown"
          size={20}
          className={`text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <p>Manage your personal information and profile details</p>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={handleStartEdit}
              >
                Edit Profile
              </Button>
            )}
          </div>

          <ProfileImageSection
            isEditing={isEditing}
            profileImage={profileData?.profileImage?.url || profileData?.profileImage} 
            onFileSelected={setSelectedImageFile}
          />

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData?.email || ""}
                onChange={handleChange}
              />
              <Input
                label="Address"
                name="profile.address"
                value={formData?.profile.address || ""}
                onChange={handleChange}
                className="md:col-span-2"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData?.phone || ""}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="text-foreground mt-1 text-sm">{formData?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <p className="text-foreground mt-1 text-sm">
                  {formData?.email}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="text-foreground mt-1 text-sm">
                  {formData?.profile?.address}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </label>
                <p className="text-foreground mt-1 text-sm">
                  {formData?.phone}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Password
                </label>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-foreground text-sm">••••••••••••••</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={onChangePasswordClick}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
                loading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ParentInfoSection;
