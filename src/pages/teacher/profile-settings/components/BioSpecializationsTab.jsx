import React, { useState } from "react";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import Button from "../../../../components/ui/Button";
import { ageGroupOptions } from "../data";
import { languageOptions } from "../../../../utils/utils";

const BioSpecializationsTab = ({
  formData,
  onFormChange,
  onSave,
  isSaving,
  isEdit,
  errors,
}) => {
  const [bioLength, setBioLength] = useState(formData?.bio?.length || 0);
  const maxBioLength = 500;

  const handleInputChange = (field, value) => {
    console.log(field, value);
    onFormChange(field, value);
  };

  const handleBioChange = (e) => {
    const value = e?.target?.value;
    if (value?.length <= maxBioLength) {
      setBioLength(value?.length);
      handleInputChange("profile.aboutYou", value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Professional Bio */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Professional Bio
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              About You <span className="text-error">*</span>
            </label>
            <textarea
              className={`w-full min-h-[120px] px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50 ${
                errors?.bio &&
                "border-destructive focus-visible:ring-destructive"
              }`}
              placeholder="Tell students about your teaching experience, methodology, and what makes you unique as a language instructor..."
              value={formData?.profile?.aboutYou || ""}
              onChange={handleBioChange}
              required
              disabled={!isEdit}
            />
            {errors?.bio && (
              <p className="text-sm text-destructive">{errors?.bio}</p>
            )}
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Share your teaching philosophy and what students can expect from
                your lessons
              </p>
              <span
                className={`text-xs font-medium ${
                  bioLength > maxBioLength * 0.9
                    ? "text-warning"
                    : "text-muted-foreground"
                }`}
              >
                {bioLength}/{maxBioLength}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Teaching Style <span className="text-error">*</span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50 ${
                errors?.teachingStyle &&
                "border-destructive focus-visible:ring-destructive"
              }`}
              placeholder="Tell students about your teaching experience, methodology, and what makes you unique as a language instructor..."
              value={formData?.profile?.teachingStyle || ""}
              onChange={(e) =>
                handleInputChange("profile.teachingStyle", e.target.value)
              }
              required
              disabled={!isEdit}
            />
          </div>
          {errors?.teachingStyle && (
            <p className="text-sm text-destructive">{errors?.teachingStyle}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Why They Love Teaching <span className="text-error">*</span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50 ${
                errors?.whyLoveTeaching &&
                "border-destructive focus-visible:ring-destructive"
              }`}
              placeholder="Tell students about your teaching experience, methodology, and what makes you unique as a language instructor..."
              value={formData?.profile?.whyTeaching || ""}
              onChange={(e) =>
                handleInputChange("profile.whyTeaching", e.target.value)
              }
              required
              disabled={!isEdit}
            />
          </div>
          {errors?.whyLoveTeaching && (
            <p className="text-sm text-destructive">
              {errors?.whyLoveTeaching}
            </p>
          )}
        </div>
      </div>
      {/* Language Proficiency */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Language Proficiency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Languages You Teach"
            description="Select all languages you can teach professionally"
            multiple
            searchable
            clearable
            options={languageOptions}
            value={formData?.profile?.teachingLanguages || []}
            onChange={(value) =>
              handleInputChange("profile.teachingLanguages", value)
            }
            placeholder="Select languages..."
            required
            disabled={!isEdit}
            error={errors?.teachingLanguages}
          />
          <Select
            label="Native Language"
            description="Your mother tongue"
            options={languageOptions}
            value={formData?.profile?.nativeLanguage || ""}
            onChange={(value) =>
              handleInputChange("profile.nativeLanguage", value)
            }
            placeholder="Select your native language"
            required
            disabled={!isEdit}
            error={errors?.nativeLanguage}
          />
        </div>
      </div>
      {/* Teaching Specializations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Teaching Specializations
        </h3>
        <div className="space-y-4">
          <Select
            label="Age Groups You Teach"
            description="Select all age groups you're comfortable teaching"
            multiple
            options={ageGroupOptions}
            value={formData?.profile?.ageGroupTeach || []}
            onChange={(value) =>
              handleInputChange("profile.ageGroupTeach", value)
            }
            placeholder="Select age groups..."
            required
            disabled={!isEdit}
            error={errors?.ageGroupTeach}
          />

          <Input
            label="Teaching Specialties"
            type="text"
            placeholder="e.g., Business English, Conversational Spanish, IELTS Preparation"
            description="Comma-separated list of your teaching specialties"
            value={formData?.profile?.teachingSpecialties || ""}
            onChange={(e) =>
              handleInputChange("profile.teachingSpecialties", e?.target?.value)
            }
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
          Save Bio & Specializations
        </Button>
      </div>
    </div>
  );
};

export default BioSpecializationsTab;
