import React, { useState } from "react";
import Select from "../../../../components/ui/Select";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import AddressFields from "components/address/AddressFields";

const StudentSelector = ({
  students,
  selectedStudent,
  onStudentSelect,
  course,
  address,
  onAddressChange,
  errors = "",
}) => {
  const [bookingAddress, setBookingAddress] = useState(null);
  const isInPersonOneOnOne =
    course?.mode === "in-person" && course?.lessonType === "1-on-1";

  const studentOptions = students?.map((student) => ({
    value: student?._id,
    label: student?.name,
    // description: `Age ${student?.age}`,
    student: student, // Include full student object for easy access
  }));

  const handleStudentChange = (studentId) => {
    const selectedStudentData = students?.find(
      (student) => student?._id === studentId
    );
    onStudentSelect(selectedStudentData);
  };

  // Custom option renderer for the select dropdown
  const renderStudentOption = (option) => {
    const student = option?.student;
    return (
      <div className="flex items-center space-x-3 p-2">
        <Image
          src={student?.profileImage?.url}
          alt={"No Image"}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-foreground">{student?.name}</p>
          {/* <p className="text-xs text-text-secondary">Age {student?.age}</p> */}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Select Student
      </h2>

      <div className="space-y-4">
        <Select
          label="Choose student for this class"
          placeholder="Select a student..."
          options={studentOptions}
          value={selectedStudent?._id}
          onChange={handleStudentChange}
          required
          className="w-full"
        />

        {/* Selected Student Preview */}
        {selectedStudent && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Image
                src={
                  selectedStudent?.profileImage?.url ||
                  selectedStudent?.profileImage ||
                  null
                }
                alt={"No Image"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {selectedStudent?.name}
                </p>
                <p className="text-sm text-text-secondary">
                  Age {selectedStudent?.age}
                </p>
              </div>
              <div className="flex items-center text-primary">
                <Icon name="CheckCircle" size={20} />
              </div>
            </div>
          </div>
        )}

        {/* Previously used Input for address – replace with AddressAutocomplete */}
        {isInPersonOneOnOne && (
          <div className="mt-4 pb-4">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Your Address (For In-person 1-on-1 course){" "}
              <span className="text-error">*</span>
            </h3>

            <AddressFields
              value={address || bookingAddress}
              onChange={(val) => {
                setBookingAddress(val);
                onAddressChange(val);
              }}
              errors={errors?.address || {}}
            />
          </div>
        )}

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                Please select which student will be attending this class. You
                can add more students from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSelector;
