import { useRef, useState } from "react";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import api from "../../../../utils/axiosInstance";

const ProfileImageSection = ({ isEditing, profileImage, onFileSelected }) => {
  const [imagePreview, setImagePreview] = useState(profileImage?.url || "");
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = async () => {
    setImagePreview("");
    if (!profileImage) {
      onFileSelected({ type: "init", file: null });
      return;
    }
    profileImage = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ✅ reset input value
    }
    if (onFileSelected) onFileSelected({ type: "delete", file: null });
  };

  const handleImageUpload = (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result;
      setImagePreview(imageUrl);
      if (onFileSelected) onFileSelected({ type: "upload", file });

      // ✅ after processing, reset file input value (optional)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-start space-x-6  mb-6">
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
              <Icon name="User" size={48} className="text-muted-foreground" />
            </div>
          )}
        </div>
        {imagePreview && isEditing && (
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-8 h-8 bg-error text-error-foreground rounded-full flex items-center justify-center hover:bg-error/90 transition-smooth"
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
          disabled={!isEditing}
        />
        <label htmlFor="profile-image-upload">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleButtonClick}
            disabled={!isEditing}
          >
            <Icon name="Upload" size={16} className="mr-2" />
            Upload Photo
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ProfileImageSection;
