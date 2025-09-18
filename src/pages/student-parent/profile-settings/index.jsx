import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ParentInfoSection from "./components/ParentInfoSection";
import StudentInfoSection from "./components/StudentInfoSection";
import StudentProfileSection from "./components/StudentProfileSection";
import ChildSelector from "./components/ChildSelector";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { selectAuthUser } from "features/auth/authSelectors";
import { capitalize } from "../../../utils/utils";

const ProfileAccountSettings = () => {
  const authUser = useSelector(selectAuthUser);
  const isParent = authUser?.role === "parent";
  const isStudent = authUser?.role === "student";

  const parentData = useSelector((state) => state.profile.parent);
  const students = useSelector((state) => state.profile.students);

  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    student: isParent,
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleSectionToggle = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleProfileSave = (updatedData) => {
    // Dispatch your action or API call here to save profile updates
    console.log("Profile saved:", updatedData);
  };

  const studentProfile = isStudent
    ? students.find((s) => s.email === authUser.email) || authUser
    : authUser;

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header and language/role indicators */}
          <div className="my-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Profile & Account Settings
                </h1>
                <p className="text-text-secondary mt-1">
                  Manage your personal information, and preferences
                </p>
              </div>
              {isParent && <ChildSelector />}
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="py-1 bg-primary/10 text-primary font-medium rounded-full">
                {capitalize(authUser.role)} Account
              </span>
              <span className="text-text-secondary">
                • Language: {currentLanguage.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            {isParent && (
              <>
                <ParentInfoSection
                  isExpanded={expandedSections.personal}
                  onToggle={() => handleSectionToggle("personal")}
                  profileData={parentData}
                  onSave={handleProfileSave}
                  onChangePasswordClick={() => setShowChangePassword(true)}
                />
                <StudentInfoSection
                  isExpanded={expandedSections.student}
                  onToggle={() => handleSectionToggle("student")}
                />
              </>
            )}
            {isStudent && studentProfile && (
              <StudentProfileSection
                isExpanded={expandedSections.personal}
                onToggle={() => handleSectionToggle("personal")}
                profileData={studentProfile}
                onSave={handleProfileSave}
                onChangePasswordClick={() => setShowChangePassword(true)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                <p>Last updated: 8/1/2025</p>
                <p>All changes are automatically saved</p>
              </div>
              <button className="text-sm font-medium text-error hover:text-error/80 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal Overlay */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        </div>
      )}
    </div>
  );
};

export default ProfileAccountSettings;
