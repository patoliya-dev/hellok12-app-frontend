import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SchoolProfileSection from "./components/SchoolProfileSection";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import ChangePasswordModal from "./components/ChangePasswordModal";
import Icon from "components/AppIcon";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getLanguageName } from "../../../utils/utils";
import { updateProfile as updateProfileThunk } from "reducers/profile/profileThunks";
import Loader from "components/ui/Loader";
import { fetchCurrentUser } from "reducers/auth/authThunks";

const ProfileAccountSettings = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ personal: true });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      await dispatch(fetchCurrentUser());
      setIsLoading(false);
    }
    getData();
  }, [dispatch]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleSectionToggle = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleProfileSave = async (updatedData) => {
    const result = await dispatch(updateProfileThunk(updatedData));
    if (updateProfileThunk.fulfilled.match(result)) {
      const refreshed = result.payload;
      return refreshed;
    }
    throw new Error(result.payload?.error);
  };

  const lastUpdatedRaw = authUser?.profile?.updatedAt || authUser?.updatedAt;
  const lastUpdatedText = lastUpdatedRaw
    ? new Date(lastUpdatedRaw).toLocaleDateString("en-GB")
    : "N/A";

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header and language/role indicators */}
          <div className="my-8">
            <h1 className="text-3xl font-bold text-foreground">
              Profile & Account Settings
            </h1>
            <p className="text-text-secondary mt-1">
              Manage school information, and preferences
            </p>
            <div className="mt-3 text-sm text-muted-foreground flex items-center gap-1.5">
              <Icon name="Dot" size={24} strokeWidth={3} className="shrink-0" />
              <span>
                Language: {getLanguageName(currentLanguage) || "English"}
              </span>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            <SchoolProfileSection
              isExpanded={expandedSections.personal}
              onToggle={() => handleSectionToggle("personal")}
              profileData={authUser}
              onSave={handleProfileSave}
              onChangePasswordClick={() => setShowChangePassword(true)}
            />
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                <p>Last updated: {lastUpdatedText}</p>
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
