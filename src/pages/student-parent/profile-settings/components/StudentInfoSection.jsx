import React, { useEffect, useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";
import { useDispatch } from "react-redux";
import ChildProfileCard from "./ChildProfileCard";
import AddChildForm from "./AddChildForm";
import Button from "components/ui/Button";
import { errorToast, successToast } from "../../../../utils/utils";
import {
  updateProfile as updateProfileThunk,
  addStudentToParent,
  deleteStudentFromParent,
} from "reducers/profile/profileThunks";

const StudentInfoSection = ({
  isExpanded,
  onToggle,
  studentData,
}) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const handleUpdate = async (id, data) => {
    try {
      const result = await dispatch(updateProfileThunk({ id, ...data }));
      if (!updateProfileThunk.fulfilled.match(result)) {
        throw new Error(
          result.payload?.error || "Failed to update student profile"
        );
      }

      successToast("Student profile updated successfully!");
    } catch (err) {
      errorToast(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteStudentFromParent(id));
      if (!deleteStudentFromParent.fulfilled.match(result)) {
        throw new Error(result.payload || "Failed to delete student");
      }
      successToast("Student deleted successfully!");
    } catch (err) {
      errorToast(err?.response?.data?.message || "Failed to delete student");
    }
  };

  const handleAdd = async (data) => {
    try {
      // Shape payload to expected server format
      if (!data?.fullName || !data?.age || !data?.gender || !data?.languages) {
        errorToast("Please fill all required fields");
        return;
      }
      const payload = {
        name: data.fullName,
        ...(data?.email && { email: data.email }),
        role: "student",
        phone: data?.phone,
        profile: {
          address: data.address,
          age: data.age,
          gender: data.gender,
          languages: Array.isArray(data.languages)
            ? data.languages
            : [data.language],
        },
      };
      const result = await dispatch(addStudentToParent(payload));
      if (!addStudentToParent.fulfilled.match(result)) {
        throw new Error(result.payload || "Failed to add student");
      }
      successToast("Student added successfully!");
    } catch (err) {
      errorToast(err?.response?.data?.error || "Failed to add student");
    }
  };

  return (
    <section className="w-full mb-5 bg-card border border-border rounded-lg shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
      >
        <div className="flex items-center space-x-3">
          <GraduationCap className="text-primary" size={20} />
          <h2 className="text-lg font-semibold text-foreground">
            Student Information
          </h2>
        </div>
        <ChevronDown
          className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
            }`}
          size={20}
        />
      </button>

      {isExpanded && (
        <div className="px-4 md:px-5 pb-5 border-t border-border pt-4">
          <div className="space-y-6">
            {Array.isArray(studentData) &&
              studentData.length > 0 &&
              studentData.map((child, idx) => (
                <ChildProfileCard
                  key={child?._id}
                  child={child}
                  childIndex={idx + 1}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
          </div>
          {isAdding && (
            <AddChildForm
              onAdd={async (data) => {
                await handleAdd(data);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          )}
          <div className="flex justify-center my-4">
            <Button
              onClick={() => setIsAdding(true)}
              variant="default"
              size="lg"
              iconName="Plus"
              iconPosition="left"
            >
              Add Student
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentInfoSection;
