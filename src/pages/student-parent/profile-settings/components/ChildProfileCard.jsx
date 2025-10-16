import React, { useState, useEffect } from "react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import ProfileImageSection from "./ProfileImageSection";
import set from "lodash/set";
import api from "../../../../utils/axiosInstance";
import { upsertAttachmentAndUpdateEntity } from "../../../../utils/s3";
import { errorToast, successToast } from "../../../../utils/utils";

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const LANGUAGE_OPTIONS = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Chinese", value: "Chinese" },
  { label: "Japanese", value: "Japanese" },
];

const ChildProfileCard = ({ child, childIndex, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formData, setFormData] = useState(child);
  useEffect(() => setFormData(child), [child]);

  const languagesArray = formData.studentProfile?.languages
    ? formData.studentProfile.languages
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
    setFormData((prev) => ({ ...prev, gender: value }));
  const handleLanguagesChange = (values) =>
    setFormData((prev) => ({
      ...prev,
      studentProfile: { ...prev.studentProfile, languages: [...values] },
    }));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = { ...formData, profile: formData.studentProfile };
      delete payload.studentProfile;

      if (!selectedImageFile) {
        await onUpdate(child._id, payload);
        successToast("Profile updated successfully");
        setIsEditing(false);
        return;
      }

      const existingAttachmentId =
        formData?.profileImage?._id ||
        formData?.studentProfile?.profileImage?._id ||
        formData?.studentProfile?.profileImageAttachmentId;

      await upsertAttachmentAndUpdateEntity({
        file: selectedImageFile,
        entityType: "User",
        entityId: formData?._id || child._id,
        existingAttachmentId,
        apiClient: api,
        onUpdateEntity: async () => onUpdate(child._id, payload),
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
    setFormData(child);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-6">
        <div className="flex justify-between mb-4 items-start">
          <h3 className="text-base font-medium text-foreground">
            Profile Photo
          </h3>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              className="text-error"
              onClick={() => {
                if (window.confirm("Delete this student?")) onDelete(child._id);
              }}
            >
              Delete Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
            <span className="text-xs text-muted-foreground px-3 py-1 border border-border rounded bg-muted/50 ml-2 flex items-center">
              Child {childIndex}
            </span>
          </div>
        </div>
        <ProfileImageSection
          isEditing={isEditing}
          profileImage={child?.profileImage?.url || child?.profileImage}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Display fields */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Full Name
            </label>
            <p className="text-foreground mt-1 text-sm">{child.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email Address
            </label>
            <p className="text-foreground mt-1 text-sm">{child.email}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              Address
            </label>
            <p className="text-foreground mt-1 text-sm">
              {child.studentProfile.address}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Age
            </label>
            <p className="text-foreground mt-1 text-sm">
              {child.studentProfile.age}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Gender
            </label>
            <p className="text-foreground mt-1 text-sm">
              {child.studentProfile.gender}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Languages
            </label>
            <p className="text-foreground mt-1 text-sm">
              {child.studentProfile.languages.join(", ")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-6">
      <div className="flex justify-between mb-4 items-start">
        <h3 className="text-base font-medium text-foreground">Edit Profile</h3>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleSave} loading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>
      <ProfileImageSection
        isEditing={isEditing}
        profileImage={formData?.profileImage?.url || formData?.profileImage}
        onFileSelected={setSelectedImageFile}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <Input
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          placeholder="Address"
          name="studentProfile.address"
          value={formData.studentProfile.address}
          onChange={handleChange}
          className="md:col-span-2"
        />
        <Input
          placeholder="Age"
          name="studentProfile.age"
          value={formData.studentProfile.age}
          onChange={handleChange}
        />
        <Select
          label="Gender"
          value={formData.studentProfile.gender}
          options={GENDER_OPTIONS}
          onChange={handleGenderChange}
        />
        <Select
          label="Languages"
          multiple
          value={languagesArray}
          options={LANGUAGE_OPTIONS}
          onChange={handleLanguagesChange}
        />
      </div>
    </div>
  );
};

export default ChildProfileCard;
