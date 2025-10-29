import React, { useState, useRef } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";

const UploadZone = ({ onFileUpload, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedFormats = {
    video: ["mp4", "mov"],
    image: ["jpg", "jpeg", "png"],
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter((file) => {
      const extension = file?.name?.split(".")?.pop()?.toLowerCase();
      return [...acceptedFormats?.video, ...acceptedFormats?.image]?.includes(
        extension
      );
    });
    console.log(validFiles, "validFiles");
    if (validFiles?.length > 0) {
      onFileUpload(validFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card rounded-xl border-2 border-dashed border-border p-8 mb-8 transition-all duration-300">
      <div
        className={`
          relative rounded-lg p-8 text-center transition-all duration-300
          ${
            isDragOver
              ? "bg-primary/10 border-primary border-2 border-dashed"
              : "bg-muted/50 border-border border-2 border-dashed hover:bg-muted/70"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <Icon
                name="Upload"
                size={32}
                className="text-primary animate-pulse"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Uploading your content...
              </h3>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {uploadProgress}% complete
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="CloudUpload" size={32} className="text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Upload Your Teaching Highlights
              </h3>
              <p className="text-muted-foreground">
                Drag and drop your files here, or click to browse
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="bg-success/20 text-success px-2 py-1 rounded-full">
                MP4
              </span>
              <span className="bg-success/20 text-success px-2 py-1 rounded-full">
                MOV
              </span>
              <span className="bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                JPG
              </span>
              <span className="bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                PNG
              </span>
            </div>

            <Button
              variant="outline"
              onClick={openFileDialog}
              iconName="FolderOpen"
              iconPosition="left"
              className="mt-4"
            >
              Choose Files
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".mp4,.mov,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Maximum file size: 100MB per file • Supported formats: MP4, MOV, JPG,
          PNG
        </p>
      </div>
    </div>
  );
};

export default UploadZone;
