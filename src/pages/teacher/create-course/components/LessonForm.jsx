import { useState } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import Input from "components/ui/Input";

const LessonFormInstance = ({
  index,
  formData,
  handleInputChange,
  errors,
  showAddButton,
  onAddLesson,
  onDeleteLesson,
}) => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex justify-between">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-white">
          {index}
        </div>
        {index !== 1 && (
          <Icon
            name="Trash2"
            size={24}
            className="text-error cursor-pointer"
            onClick={onDeleteLesson}
          />
        )}
      </div>
      <div className="px-10">
        <Input
          label="Lesson Title"
          type="text"
          placeholder="Enter lesson title"
          value={formData?.lessonTitle}
          required
          error={errors?.lessonTitle}
          onChange={(e) => handleInputChange("lessonTitle", e?.target?.value)}
          className="!mb-4"
        />
        <Input
          label="Description"
          type="text"
          placeholder="Describe what students will learn in this lesson"
          value={formData?.lessonDescription}
          required
          error={errors?.lessonDescription}
          onChange={(e) =>
            handleInputChange("lessonDescription", e?.target?.value)
          }
          className="!mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <Checkbox
            label="Trial Available"
            description="Allow students to book trial lessons for this lesson"
            checked={!!formData.trialAvailable}
            onChange={(e) =>
              handleInputChange("trialAvailable", e.target.checked)
            }
          />

          {formData?.trialAvailable && (
            <Input
              label="Trial Capacity"
              placeholder="Enter number of trial lesson spots"
              type="number"
              min="1"
              value={formData?.trialCapacity}
              onChange={(e) =>
                handleInputChange("trialCapacity", e?.target?.value)
              }
              required={formData?.trialAvailable}
              error={errors?.trialCapacity}
            />
          )}
        </div>

        {/* <Checkbox
          label="Curriculum-Aligned Games"
          description="Allow curriculum-aligned games for this lesson"
          checked={!!formData.curriculumGames}
          onChange={(e) =>
            handleInputChange("curriculumGames", e.target.checked)
          }
        /> */}
      </div>

      {showAddButton && (
        <div className="flex justify-center mt-4">
          <Button size="lg" iconName="Plus" onClick={onAddLesson}>
            Add More Lesson
          </Button>
        </div>
      )}
    </div>
  );
};

export default function LessonForm({
  formData,
  errors,
  handleInputChange,
  addLesson,
  removeLesson,
}) {
  return (
    <>
      {formData?.lessons.map((lesson, index) => (
        <>
          <LessonFormInstance
            key={index}
            index={index + 1}
            formData={lesson}
            errors={errors.lessons?.[index] || {}}
            handleInputChange={(field, value) =>
              handleInputChange(field, value, index)
            }
            onAddLesson={() => addLesson(index)}
            onDeleteLesson={() => removeLesson(index)}
            showAddButton={index === formData.lessons.length - 1}
          />
          {index !== formData?.lessons.length - 1 && <hr className="!my-8" />}
        </>
      ))}
    </>
  );
}
