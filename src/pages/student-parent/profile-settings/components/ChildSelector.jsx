import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectStudent } from "reducers/profile/profileSlice";
import { successToast } from "../../../../utils/utils";

const ChildSelector = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.profile.students);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (
      students.length > 0 &&
      (!selectedChildId || !students.some((s) => s.id === selectedChildId))
    ) {
      dispatch(selectStudent(students[0].id));
    }
  }, [selectedChildId, students, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const selectedStudent = students.find((s) => s.id === selectedChildId);
  const studentName = selectedStudent?.fullName || selectedStudent?.name || "";
  const initials =
    studentName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "";

  // Don't render if no students
  if (students.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 md:mt-2" ref={dropdownRef}>
      <label className="text-sm font-medium text-foreground mb-2 block">
        Select Child Dashboard
      </label>

      {/* Card trigger */}
      <div
        className="flex items-center justify-between p-3 border border-border rounded-lg bg-card w-full md:w-72 cursor-pointer relative"
        onClick={() => setDropdownOpen((open) => !open)}
        aria-label="Select Child Dashboard"
        tabIndex={0}
      >
        <div className="flex items-center space-x-3">
          {selectedStudent?.profileImage ? (
            <img
              src={selectedStudent.profileImage}
              alt={initials}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground text-sm">
              {studentName || "Select a child"}
            </p>
            <p className="text-text-secondary text-xs">
              {selectedStudent?.grade || "Grade"} •{" "}
              {selectedStudent?.language || "English"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`text-muted-foreground transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          size={20}
        />
        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-full md:w-72 bg-white border border-border rounded-lg shadow-lg z-50">
            {students.map((student) => {
              console.log(student);
              const menuInitials = (student.fullName || student.name || "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
              return (
                <div
                  key={student.id}
                  className={`flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-pink-50 ${
                    selectedChildId === student.id ? "bg-pink-100" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(selectStudent(student.id));
                    setDropdownOpen(false);
                    successToast("Student selected successfully!");
                  }}
                >
                  {student?.profileImage ? (
                    <img
                      src={student?.profileImage}
                      alt={menuInitials}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      {menuInitials}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {student.fullName || student.name || "Unnamed Child"}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {student.grade || "Grade"} •{" "}
                      {student.language || "English"}
                    </p>
                  </div>
                </div>
              );
            })}
            {students.length === 0 && (
              <div className="px-4 py-2 text-text-secondary text-sm">
                No students found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildSelector;
