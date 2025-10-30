import React, { useState, useRef, useEffect } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Image from "../../../../components/AppImage";
import Icon from "../../../../components/AppIcon";
import DeleteModal from "components/ui/DeleteModal";
import api from "../../../../utils/axiosInstance";
import { successToast } from "../../../../utils/utils";

const CertificationsTab = ({
  formData,
  onFormChange,
  onSave,
  isSaving,
  isEdit,
  errors,
  onCertificateFilesChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificateId, setCertificateId] = useState(null);
  const fileInputRef = useRef(null);
  const [currentCertificates, setCurrentCertificates] = useState([]);

  useEffect(() => {
    setCurrentCertificates(formData?.profile?.certificates || []);
  }, [formData?.profile?.certificates]);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (field, value) => {
    onFormChange(field, value);
  };

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    if (onCertificateFilesChange) {
      onCertificateFilesChange(fileArray);
    }

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newCertificate = {
          _id: "upload-" + Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          url: e.target?.result,
          uploadDate: new Date().toISOString(),
          size: file.size,
        };
        setCurrentCertificates((prevCertificates) => {
          const updated = [...prevCertificates, newCertificate];
          return updated;
        });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);

    const files = e?.dataTransfer?.files;
    if (files && files?.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    const files = e?.target?.files;
    if (files && files?.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeCertificate = async (certificateId) => {
    const updatedCertificates = currentCertificates?.filter(
      (cert) => cert?._id !== certificateId
    );
    setCurrentCertificates(updatedCertificates);
    if (certificateId.startsWith("upload-")) {
      onCertificateFilesChange(updatedCertificates);
      return;
    }
    await api.delete(`/attachments/${certificateId}`);
    successToast("Certificate removed successfully");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + " " + sizes?.[i];
  };

  const handleDeleteModalVisibility = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <div className="space-y-6">
      {/* Teaching Credentials */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Teaching Credentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Highest Education Level"
            type="text"
            placeholder="e.g., Master's in Education, Bachelor's in Linguistics"
            value={formData?.profile?.highestEducation || ""}
            onChange={(e) =>
              handleInputChange("profile.highestEducation", e?.target?.value)
            }
            required
            disabled={!isEdit}
            error={errors?.highestEducation}
          />
          <Input
            label="Teaching License/Certification"
            type="text"
            placeholder="e.g., TESOL, TEFL, CELTA"
            value={formData?.profile?.certification || ""}
            onChange={(e) =>
              handleInputChange("profile.certification", e?.target?.value)
            }
            disabled={!isEdit}
          />
          <Input
            label="University/Institution"
            type="text"
            placeholder="Name of your alma mater"
            value={formData?.profile?.institution || ""}
            onChange={(e) =>
              handleInputChange("profile.institution", e?.target?.value)
            }
            disabled={!isEdit}
          />
          <Input
            label="Graduation Year"
            type="number"
            placeholder="2020"
            min="1970"
            max={new Date()?.getFullYear()}
            value={formData?.profile?.graduationYear || ""}
            onChange={(e) =>
              handleInputChange("profile.graduationYear", e?.target?.value)
            }
            disabled={!isEdit}
          />
        </div>
      </div>
      {/* Certificate Upload */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Upload Certificates
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your teaching certificates, diplomas, and other relevant
          credentials. Supported formats: JPG, PNG, PDF
        </p>

        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                Drag and drop your certificates here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileInputChange}
                className="hidden"
                id="certificate-upload"
                disabled={!isEdit}
              />
              <label htmlFor="certificate-upload">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleFileButtonClick}
                  disabled={!isEdit}
                >
                  <Icon name="FolderOpen" size={16} className="mr-2" />
                  Browse Files
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Uploaded Certificates */}
        {currentCertificates?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-foreground mb-4">
              Uploaded Certificates ({currentCertificates?.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCertificates?.map((certificate) => (
                <div
                  key={certificate?._id}
                  className="border border-border rounded-lg p-4 bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {certificate?.name.substring(
                          certificate?.name.indexOf("_") + 1
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(certificate?.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCertificateId(certificate?._id);
                        handleDeleteModalVisibility();
                      }}
                      className="ml-2 p-1 text-muted-foreground hover:text-error transition-smooth disabled:cursor-not-allowed"
                      disabled={!isEdit}
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>

                  {certificate?.url && (
                    <div className="aspect-video bg-background rounded border overflow-hidden">
                      {certificate?.name?.toLowerCase()?.includes(".pdf") ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon
                            name="FileText"
                            size={32}
                            className="text-muted-foreground"
                          />
                        </div>
                      ) : (
                        <Image
                          src={certificate?.url}
                          alt={certificate?.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex space-x-2">
                    <Button variant="outline" size="sm" fullWidth>
                      <Icon name="Eye" size={14} className="mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Additional Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Additional Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Awards & Recognition"
            type="text"
            placeholder="e.g., Teacher of the Year 2023, Excellence in Online Teaching"
            description="Any awards or recognition you've received"
            value={formData?.profile?.awards || ""}
            onChange={(e) =>
              handleInputChange("profile.awards", e?.target?.value)
            }
            disabled={!isEdit}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Notes
            </label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any additional information about your qualifications or experience..."
              value={formData?.profile?.additionalNotes || ""}
              onChange={(e) =>
                handleInputChange("profile.additionalNotes", e?.target?.value)
              }
              disabled={!isEdit}
            />
          </div>
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
          Save Certifications
        </Button>
      </div>

      {showDeleteModal && (
        <DeleteModal
          type="certificate"
          onConfirm={() => {
            removeCertificate(certificateId);
            handleDeleteModalVisibility();
          }}
          onClose={handleDeleteModalVisibility}
        />
      )}
    </div>
  );
};

export default CertificationsTab;
