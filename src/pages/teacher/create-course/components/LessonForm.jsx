import { useState } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import Input from "components/ui/Input";
import DeleteModal from "components/ui/DeleteModal";
import { successToast } from "../../../../utils/utils";
import WeeklySchedule from "../../../../components/ui/WeeklySchedule";
import DurationRange from "components/ui/DurationRange";

const LessonFormInstance = ({
  index,
  formData,
  handleInputChange,
  errors,
  showAddButton,
  onAddLesson,
  onDeleteLesson,
  mode,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
            onClick={() => {
              const hasContent =
                formData?.lessonTitle?.trim() &&
                formData?.lessonDescription?.trim();

              if (mode === "edit" && hasContent) {
                setShowDeleteModal(true);
              } else {
                onDeleteLesson();
              }
            }}
          />
        )}
      </div>
      <div className="px-10">
        <div className="mb-4">
          <Input
            label="Lesson Title"
            type="text"
            placeholder="Enter lesson title"
            value={formData?.lessonTitle}
            required
            error={errors?.lessonTitle}
            onChange={(e) => handleInputChange("lessonTitle", e?.target?.value)}
          />
        </div>
        <div className="mb-4">
          <h5 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
            Description
            <span className="text-destructive ml-1">*</span>
          </h5>
          <textarea
            rows={4}
            placeholder="Describe what students will learn in this lesson"
            value={formData?.lessonDescription}
            onChange={(e) =>
              handleInputChange("lessonDescription", e?.target?.value)
            }
            className={`border rounded-lg p-4 resize-none text-foreground w-full focus:outline-none focus:border-primary !mt-1 ${
              errors?.lessonDescription ? "border-destructive" : "border-border"
            }`}
          />

          {errors?.lessonDescription && (
            <p className="text-destructive text-sm">
              {errors?.lessonDescription}
            </p>
          )}
        </div>

        <WeeklySchedule />
        <DurationRange />

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
          checked={!!formData.isCurriculumGames}
          onChange={(e) =>
            handleInputChange("isCurriculumGames", e.target.checked)
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

      {showDeleteModal && (
        <DeleteModal
          type="lesson"
          onConfirm={() => {
            onDeleteLesson();
            setShowDeleteModal(false);
            successToast("Lesson removed successfully!");
          }}
          onClose={() => setShowDeleteModal(false)}
        />
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
  mode,
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
            mode={mode}
          />
          {index !== formData?.lessons.length - 1 && <hr className="!my-8" />}
        </>
      ))}
    </>
  );
}
