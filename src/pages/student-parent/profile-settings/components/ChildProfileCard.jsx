import React, { useState, useEffect } from "react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import ProfileImageSection from "./ProfileImageSection";

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
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
  const [formData, setFormData] = useState(child);

  useEffect(() => setFormData(child), [child]);

  const languagesArray = formData.language
    ? formData.language.split(",").map((l) => l.trim())
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value) =>
    setFormData((prev) => ({ ...prev, gender: value }));
  const handleLanguagesChange = (values) =>
    setFormData((prev) => ({ ...prev, language: values.join(", ") }));

  const handleSave = () => {
    onUpdate(child.id, formData);
    setIsEditing(false);
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
                if (window.confirm("Delete this student?")) onDelete(child.id);
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
          profileImage={child?.profileImage}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Display fields */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Full Name
            </label>
            <p className="text-foreground mt-1 text-sm">{child.fullName}</p>
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
            <p className="text-foreground mt-1 text-sm">{child.address}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Age
            </label>
            <p className="text-foreground mt-1 text-sm">{child.age}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Gender
            </label>
            <p className="text-foreground mt-1 text-sm">{child.gender}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Languages
            </label>
            <p className="text-foreground mt-1 text-sm">{child.language}</p>
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
          <Button variant="default" size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
      <ProfileImageSection
        isEditing={isEditing}
        profileImage={formData?.profileImage}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <Input
          placeholder="Full Name"
          name="fullName"
          value={formData.fullName}
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
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="md:col-span-2"
        />
        <Input
          placeholder="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
        <Select
          label="Gender"
          value={formData.gender}
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
