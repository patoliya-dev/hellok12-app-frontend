import { useEffect, useMemo, useState } from "react";
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

const ProfileAccountSettings = () => {
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    experience: "8",
    country: "United States",
    state: "California",
    city: "San Francisco",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",

    // Bio & Specializations
    bio: `Passionate language educator with 8 years of experience teaching English and Spanish to students of all ages. I believe in creating an engaging, supportive environment where students feel confident to practice and make mistakes. My teaching approach combines conversational practice with structured grammar lessons, tailored to each student's learning style and goals.`,
    teachingStyle:
      "Their teaching style is engaging, adaptable, and student-focused, blending clear instruction with interactive activities. They strive to create a supportive environment that encourages curiosity, critical thinking, and lifelong learning.",
    whyLoveTeaching:
      "They love teaching because it shapes minds and opens doors to new possibilities. Guiding students towards growth and success brings them true fulfillment.",
    languagesTaught: ["english", "spanish"],
    nativeLanguage: "english",
    ageGroups: ["high-school", "adults"],
    specialties: "Business English, Conversational Spanish, IELTS Preparation",

    // Certifications
    education: "Master's in Applied Linguistics",
    teachingLicense: "TESOL, DELE Certified",
    institution: "University of California, Berkeley",
    graduationYear: "2015",
    awards: "Excellence in Online Teaching Award 2023",
    additionalNotes:
      "Specialized training in teaching students with learning disabilities",
    certificates: [
      {
        id: 1,
        name: "TESOL_Certificate.pdf",
        url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
        uploadDate: "2025-01-15T10:30:00Z",
        size: 2048576,
      },
      {
        id: 2,
        name: "Masters_Diploma.jpg",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        uploadDate: "2025-01-15T10:35:00Z",
        size: 1536000,
      },
    ],

    // Availability
    timeZone: "Asia/Kolkata",

    // Teaching Preferences
    onlineTeaching: true,
    inPersonTeaching: true,
    travelRadius: "15",
    travelFee: "10",
    trialRate: "25",
    regularRate: "45",
    groupRate: "30",
    packageDiscount: "15",
    maxGroupSize: "4",
    specialRequirements:
      "Reliable internet connection required for online lessons. For in-person lessons, I can provide materials or use student's preferred textbooks.",
  });
  const [errors, setErrors] = useState({});

  const validateFields = (tabName, data) => {
    let newErrors = {};

    if (tabName) {
      // ✅ validate only the selected tab
      const requiredFields = validationRules[tabName] || [];
      requiredFields.forEach((field) => {
        if (!data[field] || data[field].toString().trim() === "") {
          newErrors[field] = "This field is required";
        }
      });
    } else {
      // ✅ global save → validate all tabs
      Object.keys(validationRules).forEach((tab) => {
        const requiredFields = validationRules[tab] || [];
        requiredFields.forEach((field) => {
          if (!data[field] || data[field].toString().trim() === "") {
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
    console.log(tabName, "tabName");

    const newErrors = validateFields(tabName, formData);

    console.log(newErrors, "handle save");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      errorToast("Please fill all required fields before saving.");
      return; // stop execution
    }
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock save success
      setSaveStatus("saved");

      // Show success message
      const tabLabel = tabName
        ? tabs?.find((t) => t?.id === tabName)?.name || "section"
        : "profile";
      successToast(`${tabLabel} saved successfully!`);

      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
      console.error("Failed to save profile:", error);
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

  const handleFormChange = (updatedData) => {
    setFormData(updatedData);
    setSaveStatus("unsaved");

    // Clear errors for fields that are now valid
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      Object.keys(newErrors).forEach((field) => {
        if (updatedData[field] && updatedData[field].toString().trim() !== "") {
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
        return <PersonalInfoTab {...commonProps} />;
      case "bio":
        return <BioSpecializationsTab {...commonProps} />;
      case "certifications":
        return <CertificationsTab {...commonProps} />;
      case "availability":
        return <AvailabilityTab {...commonProps} />;
      case "preferences":
        return <TeachingPreferencesTab {...commonProps} />;
      case "highlights":
        return <TeachingHighlightsTab />;
      default:
        return <PersonalInfoTab {...commonProps} />;
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

  return (
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
