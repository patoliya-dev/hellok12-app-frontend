import React, { useState } from "react";
import { GraduationCap, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import ChildProfileCard from "./ChildProfileCard";
import AddChildForm from "./AddChildForm";
import Button from "components/ui/Button";
import {
  updateStudent,
  deleteStudent,
  addStudent,
} from "reducers/profile/profileSlice";
import api from "../../../../utils/axiosInstance";

const StudentInfoSection = ({ isExpanded, onToggle, studentData }) => {
  const dispatch = useDispatch();
  const students = studentData;
  const [isAdding, setIsAdding] = useState(false);

  const handleUpdate = async (id, data) => {
    const updatedData = await api.patch(
      `/auth/updateProfile/${data._id}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    toast.success("Student updated successfully!");
  };
  const handleDelete = (id) => dispatch(deleteStudent(id));
  const handleAdd = (data) => dispatch(addStudent(data));

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
          className={`text-muted-foreground transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
          size={20}
        />
      </button>

      {isExpanded && (
        <div className="px-4 md:px-5 pb-5 border-t border-border pt-4">
          <div className="space-y-6">
            {Array.isArray(students) &&
              students.length > 0 &&
              students.map((child, idx) => (
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
              onAdd={handleAdd}
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
