import React, { useState, useRef } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import Image from "../../../../components/AppImage";
import Icon from "../../../../components/AppIcon";

const PersonalInfoTab = ({
  formData,
  onFormChange,
  onSave,
  isSaving,
  isEdit,
}) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [profileImage, setProfileImage] = useState(
    formData?.profileImage || ""
  );
  const [imagePreview, setImagePreview] = useState(
    formData?.profileImage || ""
  );

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    onFormChange(updatedData);
  };

  const handleImageUpload = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e?.target?.result;
        setImagePreview(imageUrl);
        setProfileImage(imageUrl);
        handleInputChange("profileImage", imageUrl);
      };
      reader?.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setProfileImage("");
    handleInputChange("profileImage", "");
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Profile Photo
        </h3>
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-border">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon
                    name="User"
                    size={48}
                    className="text-muted-foreground"
                  />
                </div>
              )}
            </div>
            {imagePreview && (
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-error text-error-foreground rounded-full flex items-center justify-center hover:bg-error/90 transition-smooth"
                disabled={!isEdit}
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              Upload a professional photo to help students connect with you.
              Recommended size: 400x400px
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image-upload"
              disabled={!isEdit}
            />
            <label htmlFor="profile-image-upload">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleButtonClick}
                disabled={!isEdit}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Upload Photo
              </Button>
            </label>
          </div>
        </div>
      </div>
      {/* Basic Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 mb-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.fullName || ""}
            onChange={(e) => handleInputChange("fullName", e?.target?.value)}
            required
            disabled={!isEdit}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData?.email || ""}
            onChange={(e) => handleInputChange("email", e?.target?.value)}
            required
            disabled={!isEdit}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData?.phone || ""}
            onChange={(e) => handleInputChange("phone", e?.target?.value)}
            required
            disabled={!isEdit}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={formData?.dateOfBirth || ""}
            onChange={(e) => handleInputChange("dateOfBirth", e?.target?.value)}
            disabled={!isEdit}
          />
          <Input
            label="Years of Experience"
            type="number"
            placeholder="5"
            min="0"
            max="50"
            value={formData?.experience || ""}
            onChange={(e) => handleInputChange("experience", e?.target?.value)}
            required
            disabled={!isEdit}
          />
        </div>
      </div>
      {/* Location Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Country"
            type="text"
            placeholder="United States"
            value={formData?.country || ""}
            onChange={(e) => handleInputChange("country", e?.target?.value)}
            required
            disabled={!isEdit}
          />
          <Input
            label="State/Province"
            type="text"
            placeholder="California"
            value={formData?.state || ""}
            onChange={(e) => handleInputChange("state", e?.target?.value)}
            required
            disabled={!isEdit}
          />
          <Input
            label="City"
            type="text"
            placeholder="San Francisco"
            value={formData?.city || ""}
            onChange={(e) => handleInputChange("city", e?.target?.value)}
            required
            disabled={!isEdit}
          />
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          variant="default"
          onClick={onSave}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Save Personal Info
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
