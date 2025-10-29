import React, { useState, useEffect, useRef } from "react";
import set from "lodash/set";
import Icon from "components/AppIcon";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import ProfileImageSection from "./ProfileImageSection";
import api from "../../../../utils/axiosInstance";
import {
  capitalize,
  errorToast,
  getLanguageName,
  languageOptions,
  successToast,
} from "../../../../utils/utils";
import { upsertAttachmentAndUpdateEntity } from "../../../../utils/s3";

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const StudentProfileSection = ({
  isExpanded,
  onToggle,
  profileData,
  onSave,
  onChangePasswordClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formData, setFormData] = useState(profileData || {});
  const latestProfileData = useRef(profileData || {});

  useEffect(() => {
    async function getData() {
      const { data } = await api.get("/auth/me");
      if (data) {
        setFormData(data.data);
        latestProfileData.current = data.data;
      }
    }
    getData();
    // setFormData(profileData || {});
    setIsEditing(false);
  }, [profileData]);

  // Update ref when profileData prop changes
  useEffect(() => {
    if (profileData) {
      latestProfileData.current = profileData;
    }
  }, [profileData]);

  const languagesArray = formData?.profile?.languages
    ? formData.profile.languages
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev };
      set(updated, name, value);
      return updated;
    });
  };

  const handleGenderChange = (value) =>
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, gender: value },
    }));
  const handleLanguagesChange = (values) =>
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, languages: values },
    }));

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (
        (selectedImageFile?.type !== "delete" && !selectedImageFile?.file) ||
        !selectedImageFile
      ) {
        await onSave(formData);
        successToast("Profile updated successfully");
        setIsEditing(false);
        return;
      }

      const existingAttachmentId =
        formData?.profileImage?._id ||
        formData?.profile?.profileImageAttachmentId;

      if (selectedImageFile?.type === "delete") {
        console.log("id", formData?.profileImage?._id);
        await api.delete(`/attachments/${formData?.profileImage?._id}`);
        await onSave(formData);
        successToast("Profile updated successfully");
        setSelectedImageFile(null);
        setIsEditing(false);
        return;
      }
      const { key } = await upsertAttachmentAndUpdateEntity({
        file: selectedImageFile?.file,
        entityType: "User",
        entityId: formData.id,
        existingAttachmentId,
        apiClient: api,
        onUpdateEntity: async (uploadedKey) => onSave({ ...formData }),
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

  const handleCancel = () => {
    setFormData(latestProfileData.current);
    setIsEditing(false);
  };

  return (
    <section className="w-full mb-5 bg-card border border-border rounded-sm shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="User" size={20} className="text-primary" />
          <h2 className="font-semibold text-lg text-foreground">
            Personal Information
          </h2>
        </div>
        <Icon
          name="ChevronDown"
          size={20}
          className={isExpanded ? "rotate-180" : "rotate-0"}
        />
      </button>

      {isExpanded && (
        <div className="p-6">
          <div className="flex justify-between py-4">
            <p> Manage your personal information and profile details</p>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          <ProfileImageSection
            isEditing={isEditing}
            profileImage={formData?.profileImage}
            onFileSelected={setSelectedImageFile}
          />

          {isEditing ? (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <Input
                label="Full Name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
              <Input
                label="Address"
                name="profile.address"
                value={formData.profile.address || ""}
                onChange={handleChange}
                className="md:col-span-2"
              />
              <Input
                label="Age"
                name="profile.age"
                type="number"
                value={formData.profile.age || ""}
                onChange={handleChange}
              />
              <Select
                label="Gender"
                options={GENDER_OPTIONS}
                value={formData.profile.gender || ""}
                onChange={handleGenderChange}
              />
              <Select
                label="Languages"
                options={languageOptions}
                multiple
                value={languagesArray}
                onChange={handleLanguagesChange}
              />
              <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                <Button variant="ghost" onClick={handleCancel} size="sm">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="mt-1 text-sm text-foreground">{formData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Phone Number
                </label>
                <p className="mt-1 text-sm text-foreground">{formData.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <p className="mt-1 text-sm text-foreground">{formData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="mt-1 text-sm text-foreground">
                  {formData?.profile?.address}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Age
                </label>
                <p className="mt-1 text-sm text-foreground">
                  {formData?.profile?.age}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <p className="mt-1 text-sm text-foreground">
                  {capitalize(formData?.profile?.gender)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">
                  Languages
                </label>
                <p className="mt-1 text-sm text-foreground">
                  {Array.isArray(formData?.profile?.languages)
                    ? formData?.profile?.languages
                        .map((l) => getLanguageName(l))
                        .join(", ")
                    : formData?.profile?.languages}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button variant="link" onClick={onChangePasswordClick}>
              Change Password
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentProfileSection;
