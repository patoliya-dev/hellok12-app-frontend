import React, { useEffect, useState } from "react";
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

const StudentInfoSection = ({
  isExpanded,
  onToggle,
  studentData,
  onChildAdded,
  onChildUpdated,
  onChildDeleted,
}) => {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setStudents(studentData);
  }, [studentData]);

  const handleUpdate = async (id, data) => {
    try {
      const res = await api.patch(`/auth/updateProfile/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      const updated = res?.data?.data || res?.data;

      setStudents((prev) =>
        Array.isArray(prev)
          ? prev.map((s) => (s?._id === id ? { ...s, ...updated } : s))
          : prev
      );

      dispatch(updateStudent({ id, data: updated }));
      if (onChildUpdated) onChildUpdated(updated);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update student profile"
      );
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/deleteChildren/${id}`);
      dispatch(deleteStudent(id));
      if (onChildDeleted) onChildDeleted(id);
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete student");
    }
  };
  const handleAdd = async (data) => {
    try {
      // Shape payload to expected server format
      const payload = {
        name: data.fullName,
        email: data.email,
        role: "student",
        phone: data.phone,
        profile: {
          address: data.address,
          age: data.age,
          gender: data.gender,
          languages: Array.isArray(data.language)
            ? data.language
            : [data.language],
        },
      };
      const res = await api.post(`/auth/addStudentToParent`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const created = res?.data?.data || res?.data;
      if (created?._id) {
        dispatch(addStudent(created));
        if (onChildAdded) onChildAdded(created);
      }
      toast.success("Student added successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add student");
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
