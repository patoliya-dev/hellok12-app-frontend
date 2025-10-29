import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import { tabs, validationRules } from "./data";
import ProfileCompletionIndicator from "./components/ProfileCompletionIndicator";
import { errorToast, successToast } from "../../../utils/utils";
import PersonalInfoTab from "./components/PersonalInfoTab";
import BioSpecializationsTab from "./components/BioSpecializationsTab";
import CertificationsTab from "./components/CertificationsTab";
import AvailabilityTab from "./components/AvailabilityTab";
import TeachingPreferencesTab from "./components/TeachingPreferencesTab";
import TeachingHighlightsTab from "./components/TeachingHighlightsTab";
import api from "../../../utils/axiosInstance";
import { upsertAttachmentAndUpdateEntity } from "../../../utils/s3";
import { updateProfile as updateProfileThunk } from "reducers/profile/profileThunks";
import Loader from "components/ui/Loader";

const ProfileAccountSettings = () => {
  const dispatch = useDispatch();
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedCertificateFiles, setSelectedCertificateFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const { data } = await api.get("/auth/me");
      if (data) {
        setFormData(data.data);
      }
      setIsLoading(false);
    }
    getData();
  }, []);

  const getFieldValue = (data, field) => {
    if (["country", "state", "city"].includes(field)) {
      return data?.[field] ?? data?.profile?.location?.[field] ?? "";
    }
    if (field === "fullName") {
      return data?.fullName ?? data?.name ?? "";
    }
    // Try top-level, then nested under profile
    return data?.[field] ?? _.get(data, `profile.${field}`, "");
  };

  const validateFields = (tabName, data) => {
    let newErrors = {};

    if (tabName) {
      const requiredFields = validationRules[tabName] || [];
      requiredFields.forEach((field) => {
        const value = getFieldValue(data, field);
        if (!value || value.toString().trim() === "") {
          newErrors[field] = "This field is required";
        }
      });
    } else {
      Object.keys(validationRules).forEach((tab) => {
        const requiredFields = validationRules[tab] || [];
        requiredFields.forEach((field) => {
          const value = getFieldValue(data, field);
          if (!value || value.toString().trim() === "") {
            newErrors[field] = "This field is required";
          }
        });
      });
    }

    return newErrors;
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <Icon
            name="Loader2"
            size={16}
            className="animate-spin text-primary"
          />
        );
      case "saved":
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case "auto-saved":
        return (
          <Icon name="Cloud" size={16} className="text-muted-foreground" />
        );
      case "error":
        return <Icon name="AlertCircle" size={16} className="text-error" />;
      case "unsaved":
        return <Icon name="Circle" size={16} className="text-warning" />;
      default:
        return null;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved";
      case "auto-saved":
        return "Auto-saved";
      case "error":
        return "Save failed";
      case "unsaved":
        return "Unsaved changes";
      default:
        return "";
    }
  };

  const handleSave = async (tabName = "") => {
    const newErrors = validateFields(tabName, formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      errorToast("Please fill all required fields before saving.");
      return;
    }
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const performUpdate = async (updatedCertificates) => {
        let updatedFormData = formData;
        if (updatedCertificates) {
          updatedFormData = {
            ...formData,
            profile: { ...formData.profile, certificates: updatedCertificates },
          };
        }
        const result = await dispatch(updateProfileThunk(updatedFormData));
        if (!updateProfileThunk.fulfilled.match(result)) {
          throw new Error(result.payload || "Failed to update profile");
        }
        // refresh form data with latest from server
        const refreshed = result.payload;
        if (refreshed) setFormData(refreshed);
      };

      if (!tabName || tabName === "personal") {
        const existingAttachmentId =
          formData?.profileImage?._id ||
          formData?.profile?.profileImageAttachmentId;

        if (selectedImageFile?.type === "delete") {
          await api.delete(`/attachments/${formData?.profileImage?._id}`);
          await performUpdate();
          successToast("Profile updated successfully");
          setSelectedImageFile(null);
          setIsEdit(false);
          return;
        }

        if (selectedImageFile?.type === "upload" && selectedImageFile?.file) {
          await upsertAttachmentAndUpdateEntity({
            file: selectedImageFile.file,
            entityType: "User",
            entityId: formData.id,
            existingAttachmentId,
            apiClient: api,
            onUpdateEntity: async () => performUpdate(),
          });
          setSelectedImageFile(null);
        } else {
          await performUpdate();
        }
      } else if (
        tabName === "certifications" &&
        selectedCertificateFiles.length > 0
      ) {
        const uploadedCertificates = [
          ...(formData?.profile?.certificates || []),
        ];
        for (const file of selectedCertificateFiles) {
          const uploaded = await upsertAttachmentAndUpdateEntity({
            file,
            entityType: "TeacherProfile",
            entityId: formData?.profile?._id,
            apiClient: api,
            scope: "certificates",
            onUpdateEntity: async () => {},
          });
          uploadedCertificates.push(uploaded?.id || Date.now() + Math.random());
        }
        setSelectedCertificateFiles([]);
        await performUpdate(uploadedCertificates);
      } else {
        await performUpdate();
      }

      setSaveStatus("saved");
      const tabLabel = tabName
        ? tabs?.find((t) => t?.id === tabName)?.name || "section"
        : "profile";
      successToast(`${tabLabel} saved successfully!`);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
      console.error("Failed to save profile:", error);
      errorToast(error?.message || "Failed to save profile");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsSaving(false);
      setIsEdit(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleNextTab = () => {
    setIsEdit(false);
    const currentIndex = tabs?.findIndex((tab) => tab?.id === activeTab);
    if (currentIndex < tabs?.length - 1) {
      setActiveTab(tabs?.[currentIndex + 1]?.id);
    }
  };

  const handlePreviousTab = () => {
    setIsEdit(false);
    const currentIndex = tabs?.findIndex((tab) => tab?.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs?.[currentIndex - 1]?.id);
    }
  };

  const handleFormChange = (field, value) => {
    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   setFormData((prev) => {
    //     const updated = { ...prev };
    //     set(updated, name, value);
    //     return updated;
    //   });
    // };
    let updatedData;
    setFormData((prev) => {
      const updated = { ...prev };
      _.set(updated, field, value);
      updatedData = updated;
      return updated;
    });
    setSaveStatus("unsaved");

    // Clear errors for fields that are now valid
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      let value;
      Object.keys(newErrors).forEach((field) => {
        if (["country", "state", "city"].includes(field)) {
          value =
            updatedData?.[field] ?? updatedData?.profile?.location?.[field];
        } else if (field === "fullName") {
          value = updatedData?.name;
        } else {
          // Try top-level first, then nested path
          value =
            updatedData?.[field] ?? _.get(updatedData, `profile.${field}`);
        }
        if (value && value.toString().trim() !== "") {
          delete newErrors[field];
        }
      });

      return newErrors;
    });
  };
  const renderTabContent = () => {
    const commonProps = {
      formData,
      onFormChange: handleFormChange,
      onSave: () => handleSave(activeTab),
      isSaving,
      isEdit,
      errors,
    };

    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoTab
            {...commonProps}
            onImageFileChange={setSelectedImageFile}
          />
        );
      case "bio":
        return <BioSpecializationsTab {...commonProps} />;
      case "certifications":
        return (
          <CertificationsTab
            {...commonProps}
            onCertificateFilesChange={setSelectedCertificateFiles}
          />
        );
      case "availability":
        return <AvailabilityTab {...commonProps} />;
      case "preferences":
        return <TeachingPreferencesTab {...commonProps} />;
      case "highlights":
        return (
          <TeachingHighlightsTab
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return (
          <PersonalInfoTab
            {...commonProps}
            onImageFileChange={setSelectedImageFile}
          />
        );
    }
  };

  const getEditButtonText = () => {
    switch (activeTab) {
      case "personal":
        return "Profile";
      case "bio":
        return "Bio";
      case "certifications":
        return "Certifications";
      case "availability":
        return "Availability";
      case "preferences":
        return "Teaching Preferences";
      default:
        return "Personal Info";
    }
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Profile & Account Settings
              </h1>
              <p className="text-muted-foreground">
                Complete your profile to start attracting students and booking
                lessons
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {saveStatus && (
                <div className="flex items-center space-x-2">
                  {getSaveStatusIcon()}
                  <span className="text-sm text-muted-foreground">
                    {getSaveStatusText()}
                  </span>
                </div>
              )}
              <Button
                variant="default"
                onClick={() => handleSave()}
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
              >
                Save All Changes
              </Button>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Tabs and Completion */}
          <div className="xl:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Profile Sections
              </h3>
              <nav className="space-y-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-smooth ${
                      activeTab === tab?.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Icon
                      name={tab?.icon}
                      size={20}
                      className={
                        activeTab === tab?.id
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }
                    />
                    <span className="font-medium">{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Profile Completion Indicator */}
            <ProfileCompletionIndicator
              formData={formData}
              activeTab={activeTab}
            />
          </div>

          {/* Right Column - Tab Content */}
          <div className="xl:col-span-3">
            <div className="bg-card border border-border rounded-lg">
              {/* Tab Header */}
              <div className="border-b border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon
                      name={
                        tabs?.find((t) => t?.id === activeTab)?.icon || "User"
                      }
                      size={24}
                      className="text-primary"
                    />
                    <h2 className="text-xl font-semibold text-foreground">
                      {tabs?.find((t) => t?.id === activeTab)?.name}
                    </h2>
                  </div>

                  {/* Tab Navigation Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousTab}
                      disabled={
                        tabs?.findIndex((t) => t?.id === activeTab) === 0
                      }
                      iconName="ChevronLeft"
                      iconPosition="left"
                      className="disabled:!cursor-not-allowed"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextTab}
                      disabled={
                        tabs?.findIndex((t) => t?.id === activeTab) ===
                        tabs?.length - 1
                      }
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
              {activeTab !== "highlights" && (
                <div className="flex justify-end px-6 pt-4">
                  {!isEdit ? (
                    <Button
                      variant="outline"
                      size="lg"
                      iconName="Edit"
                      onClick={handleEdit}
                    >
                      {`Edit ${getEditButtonText()}`}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsEdit(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}

              {/* Tab Content */}
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfileAccountSettings;
