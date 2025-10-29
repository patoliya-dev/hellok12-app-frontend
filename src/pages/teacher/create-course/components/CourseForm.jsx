import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { lessonModeOptions, lessonTypeOptions } from "../data";
import { languageOptions } from "../../../../utils/utils";
import FileUploader from "components/ui/FileUploader";
import { ageGroupOptions } from "../../profile-settings/data";

const CourseForm = ({ formData, handleInputChange, errors, introUpload }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Course Name"
          placeholder="e.g., Beginner Spanish Conversation"
          value={formData?.title}
          onChange={(e) => handleInputChange("title", e?.target?.value)}
          error={errors?.title}
          required
        />

        <Select
          label="Language"
          options={languageOptions}
          value={formData?.language || ""}
          onChange={(value) => handleInputChange("language", value)}
          error={errors?.language}
          required
          searchable
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description <span className="text-error">*</span>
        </label>
        <textarea
          className={`w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50 ${errors?.description &&
            "border-destructive focus-visible:ring-destructive"
            }`}
          placeholder="Brief description of the course content and objectives"
          value={formData?.description || ""}
          onChange={(e) =>
            handleInputChange("description", e.target.value)
          }
          required
        />

        {errors?.description && (
          <p className="text-sm text-destructive">{errors?.description}</p>
        )}
      </div>

      <div className={`grid grid-cols-1 gap-6 ${formData?.lessonType === "group" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <Select
          label="Lesson Type"
          options={lessonTypeOptions}
          value={formData?.lessonType || ""}
          onChange={(value) => handleInputChange("lessonType", value)}
        />
        {formData?.lessonType === "group" && (
          <Input
            label="Student Capacity"
            placeholder="e.g., 10"
            type="number"
            min="1"
            max="50"
            value={formData?.studentCapacity || ""}
            onChange={(e) =>
              handleInputChange("studentCapacity", parseInt(e?.target?.value))
            }
            error={errors?.studentCapacity}
          />
        )}
        <FileUploader
          label="Intro Image"
          placeholder="Upload intro image"
          required
          error={errors?.introImage}
          onChange={(e) => handleInputChange("introImage", e.target.files[0])}
          accept="image/*"
          filename={formData?.introImage}
          onRemoveImage={() => handleInputChange("introImage", null)}
          isLoading={!!introUpload?.loading}
          progress={introUpload?.progress || 0}
          previewUrl={formData?.introImageRef?.url || null}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Mode"
          options={lessonModeOptions}
          value={formData?.mode || ""}
          onChange={(value) => handleInputChange("mode", value)}
          required
          error={errors?.mode}
        />

        <Input
          label="Price ($)"
          placeholder="Enter the price"
          type="number"
          min="0"
          step="0.01"
          value={formData?.price || ""}
          onChange={(e) =>
            handleInputChange("price", parseFloat(e?.target?.value))
          }
        />

        <div className="space-y-2">
          <Select
            label="Age Range"
            multiple
            options={ageGroupOptions}
            value={formData?.ageGroups || []}
            onChange={(value) => handleInputChange("ageGroups", value)}
            placeholder="Select age groups..."
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Date"
          type="date"
          value={formData?.startDate}
          onChange={(e) => handleInputChange("startDate", e?.target?.value)}
          error={errors?.startDate}
          required
        />

        <Input
          label="End Date (Optional)"
          type="date"
          value={formData?.endDate}
          onChange={(e) => handleInputChange("endDate", e?.target?.value)}
        />
      </div>
    </>
  );
};

export default CourseForm;
