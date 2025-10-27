import React from "react";
import Icon from "../../../../components/AppIcon";
import { tabs } from "../data";
import { useSelector } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";

const ProfileCompletionIndicator = ({ formData, activeTab }) => {
  const visibleTabs = tabs.slice(0, 5);
  const user = useSelector(selectAuthUser);
  const calculateTabCompletion = (tabName) => {
    switch (tabName) {
      case "personal":
        const personalFields = [
          "name",
          "email",
          "phone",
          "profile.location.country",
          "profile.location.state",
          "profile.location.city",
          "profile.yearsOfExperience",
        ];
        const personalCompleted = personalFields?.filter((field) => {
          if (field.startsWith("profile.")) {
            const fieldKey = field.split(".")[1];
            return formData?.profile?.[fieldKey];
          } else {
            return formData?.[field]?.trim();
          }
        })?.length;
        return Math.round((personalCompleted / personalFields?.length) * 100);

      case "bio":
        const bioFields = [
          "aboutYou",
          "teachingStyle",
          "whyTeaching",
          "teachingLanguages",
          "nativeLanguage",
          "ageGroupTeach",
        ];
        const bioCompleted = bioFields?.filter((field) => {
          const value = formData?.profile?.[field];
          return Array.isArray(value) ? value?.length > 0 : value?.trim();
        })?.length;
        return Math.round((bioCompleted / bioFields?.length) * 100);

      case "certifications":
        const certFields = ["highestEducation", "certification"];
        const certCompleted = certFields?.filter((field) =>
          formData?.profile?.[field]?.trim()
        )?.length;
        const hasCertificates = formData?.profile?.certificates?.length > 0;
        return Math.round(
          ((certCompleted + (hasCertificates ? 1 : 0)) / 3) * 100
        );

      case "availability":
        const hasAvailability = formData?.profile?.timezone;
        return hasAvailability ? 100 : 0;

      case "preferences":
        const hasTeachingMode =
          formData?.profile?.teachingMode === "ONLINE" ||
          formData?.profile?.teachingMode === "IN_PERSON";
        const hasRates =
          user?.type === "independent"
            ? formData?.trialRate && formData?.regularRate
            : true;
        const completedItems = [hasTeachingMode, hasRates]?.filter(
          Boolean
        )?.length;
        return Math.round((completedItems / 2) * 100);

      default:
        return 0;
    }
  };

  const overallCompletion = Math.round(
    visibleTabs?.reduce(
      (sum, tab) => sum + calculateTabCompletion(tab?.id),
      0
    ) / visibleTabs?.length
  );

  const getCompletionColor = (percentage) => {
    if (percentage >= 100) return "text-success";
    if (percentage >= 75) return "text-primary";
    if (percentage >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  const getCompletionBgColor = (percentage) => {
    if (percentage >= 100) return "bg-success";
    if (percentage >= 75) return "bg-primary";
    if (percentage >= 50) return "bg-warning";
    return "bg-muted";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Profile Completion
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={`text-2xl font-bold ${getCompletionColor(
              overallCompletion
            )}`}
          >
            {overallCompletion}%
          </div>
          <Icon
            name={overallCompletion >= 100 ? "CheckCircle" : "Clock"}
            size={20}
            className={getCompletionColor(overallCompletion)}
          />
        </div>
      </div>
      {/* Overall Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getCompletionBgColor(
            overallCompletion
          )}`}
          style={{ width: `${overallCompletion}%` }}
        />
      </div>
      {/* Individual Tab Progress */}
      <div className="space-y-3">
        {visibleTabs?.map((tab) => {
          const completion = calculateTabCompletion(tab?.id);
          const isActive = activeTab === tab?.id;

          return (
            <div
              key={tab?.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-smooth ${
                isActive
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  name={tab?.icon}
                  size={16}
                  className={
                    isActive ? "text-primary" : "text-muted-foreground"
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {tab?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${getCompletionBgColor(
                      completion
                    )}`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium w-8 text-right ${getCompletionColor(
                    completion
                  )}`}
                >
                  {completion}%
                </span>
                {completion >= 100 && (
                  <Icon name="Check" size={14} className="text-success" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Completion Message */}
      {overallCompletion >= 100 ? (
        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-success">
                Profile Complete!
              </p>
              <p className="text-xs text-success/80">
                Your profile is ready to attract students. You can always update
                it later.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={20} className="text-warning" />
            <div>
              <p className="text-sm font-medium text-warning">
                Complete Your Profile
              </p>
              <p className="text-xs text-warning/80">
                A complete profile helps you attract more students and build
                trust.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionIndicator;
