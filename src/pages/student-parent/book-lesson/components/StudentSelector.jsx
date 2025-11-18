import React from "react";
import Select from "../../../../components/ui/Select";
import Icon from "../../../../components/AppIcon";
import Input from "../../../../components/ui/Input";
import Image from "../../../../components/AppImage";

const StudentSelector = ({
  students,
  selectedStudent,
  onStudentSelect,
  address,
  onAddressChange,
}) => {
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
          value={selectedStudent?.id}
          onChange={handleStudentChange}
          required
          className="w-full"
        />

        {/* Selected Student Preview */}
        {selectedStudent && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Image
                src={selectedStudent?.profileImage?.url}
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

        <div className="pb-4">
          <h3 className="font-medium text-foreground mb-4">Address</h3>
          <Input
            // label="Email Address"
            type="email"
            placeholder="19 Washington Square N, New York, NY 10011, USA"
            value={address}
            onChange={(e) => onAddressChange(e)}
            // error={fieldErrors.email}
            required
          // disabled={isLoading}
          />
        </div>

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
