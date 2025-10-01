import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { languageOptions, lessonTypeOptions } from "../data";

const CourseForm = ({ formData, handleInputChange, errors }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Course Name"
          placeholder="e.g., Beginner Spanish Conversation"
          value={formData?.courseName}
          onChange={(e) => handleInputChange("courseName", e?.target?.value)}
          error={errors?.courseName}
          required
        />

        <Select
          label="Language"
          options={languageOptions}
          value={formData?.language}
          onChange={(value) => handleInputChange("language", value)}
          error={errors?.language}
          required
        />
      </div>

      <Input
        label="Description"
        type="text"
        placeholder="Brief description of the course content and objectives"
        value={formData?.description}
        onChange={(e) => handleInputChange("description", e?.target?.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Lesson Type"
          options={lessonTypeOptions}
          value={formData?.lessonType}
          onChange={(value) => handleInputChange("lessonType", value)}
        />
        <Input
          type="file"
          label="Intro Image"
          placeholder="Upload intro image"
          required
          error={errors?.introImage}
          onChange={(e) => handleInputChange("introImage", e.target.files[0])}
          accept="image/*"
          fileName={formData?.introImage}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Student Capacity"
          type="number"
          min="1"
          max="50"
          value={formData?.capacity}
          onChange={(e) =>
            handleInputChange("capacity", parseInt(e?.target?.value))
          }
          error={errors?.capacity}
        />

        <Input
          label="Price per Lesson ($)"
          type="number"
          min="0"
          step="0.01"
          value={formData?.price}
          onChange={(e) =>
            handleInputChange("price", parseFloat(e?.target?.value))
          }
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Age Range
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              min="5"
              max="100"
              value={formData?.ageRange?.min}
              onChange={(e) =>
                handleInputChange("ageRange", {
                  ...formData?.ageRange,
                  min: parseInt(e?.target?.value),
                })
              }
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              min="5"
              max="100"
              value={formData?.ageRange?.max}
              onChange={(e) =>
                handleInputChange("ageRange", {
                  ...formData?.ageRange,
                  max: parseInt(e?.target?.value),
                })
              }
            />
          </div>
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
