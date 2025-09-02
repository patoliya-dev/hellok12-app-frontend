import React, { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { Checkbox } from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";

const RoleSpecificStep = ({ formData, errors, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Ensure at least one child exists for parent userType
  useEffect(() => {
    if (formData.userType === "parent" && (!formData.children || formData.children.length === 0)) {
      onChange("children", [{ name: "", age: "", gender: "" }]);
    }
  }, [formData.userType, formData.children, onChange]);

  const handleInputChange = (field, index = null) => (e) => {
    const value = e?.target?.value ?? e;

    if (field === "children" && index !== null) {
      const updatedChildren = [...(formData.children || [])];
      updatedChildren[index] = { ...updatedChildren[index], ...value };
      onChange("children", updatedChildren);
    } else {
      onChange(field, value);
    }
  };

  const handleSelectChange = (field) => (value) => onChange(field, value);

  const addChild = () => {
    const updatedChildren = [...(formData.children || []), { name: "", age: "", gender: "" }];
    onChange("children", updatedChildren);
  };

  const deleteChild = (index) => {
    const updatedChildren = [...(formData.children || [])];
    if (updatedChildren.length > 1) {
      updatedChildren.splice(index, 1);
      onChange("children", updatedChildren);
    }
  };

  const userTypeOptions = [
    { value: "student", label: "Student" },
    { value: "parent", label: "Parent" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const renderPasswordField = (label, value, show, setShow, onChangeHandler, error) => (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        label={label}
        placeholder={label}
        value={value || ""}
        onChange={onChangeHandler}
        error={error}
        required
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition"
      >
        <Icon name={show ? "EyeOff" : "Eye"} size={16} />
      </button>
    </div>
  );

  const renderCommonFields = () => (
    <div className="space-y-4">
      {/* Student/Parent Selection for combined role */}
      {formData.role === "student/parent" && (
        <Select
          label="Sign up as"
          options={userTypeOptions}
          value={formData.userType || "student"}
          onChange={handleSelectChange("userType")}
          error={errors.userType}
          required
        />
      )}

      <div className="text-left">
        <h5 className="text-sm font-bold text-foreground">
          {formData.userType === "parent"
            ? "Parent / Guardian Information"
            : formData.role === "teacher"
              ? "Teacher Information"
              : formData.role === "school"
                ? "School Information"
                : "Student Information"}
        </h5>
      </div>

      {/* Basic Inputs */}
      <Input
        label="Name"
        type="text"
        placeholder="Enter your name"
        value={formData.name || ""}
        onChange={handleInputChange("name")}
        error={errors.name}
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone || ""}
        onChange={handleInputChange("phone")}
        error={errors.phone}
        required
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email || ""}
        onChange={handleInputChange("email")}
        error={errors.email}
        required
      />

      {/* Password Fields */}
      {renderPasswordField(
        "Password",
        formData.password,
        showPassword,
        setShowPassword,
        handleInputChange("password"),
        errors.password
      )}
      {renderPasswordField(
        "Confirm Password",
        formData.confirmPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        handleInputChange("confirmPassword"),
        errors.confirmPassword
      )}

      {/* Children for Parent */}
      {formData.userType === "parent" && (
        <div>
          {formData.children?.map((child, i) => (
            <div
              key={i}
              className="space-y-2 mt-2 p-4 border rounded border-gray-200 relative"
            >
              <div className="grid grid-cols-1 gap-4">
                {!i && (
                  <div className="text-left">
                    <h5 className="text-sm font-bold text-foreground">Student Information</h5>
                  </div>
                )}

                {formData.children.length > 1 && (
                  <div className="flex items-center justify-end gap-2">
                    <Icon name="GraduationCap" size={20} className="text-primary" />
                    <span className="text-sm text-primary">Child {i + 1}</span>
                    <span className="border-r border-black/13 h-5 mx-2"></span>
                    <button
                      type="button"
                      onClick={() => deleteChild(i)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Icon name="Trash2" size={20} />
                    </button>
                  </div>
                )}
              </div>

              <Input
                label="Name"
                placeholder="Enter student name"
                value={child.name || ""}
                required
                error={errors[`name_${i}`]}
                onChange={(e) => handleInputChange("children", i)({ name: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  placeholder="Enter student age"
                  value={child.age || ""}
                  required
                  error={errors[`age_${i}`]}
                  onChange={(e) => handleInputChange("children", i)({ age: e.target.value })}
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  value={child.gender || ""}
                  required
                  error={errors[`gender_${i}`]}
                  onChange={(value) => handleInputChange("children", i)({ gender: value })}
                />
              </div>
            </div>
          ))}

          <div className="text-center">
            <Button
              variant="default"
              onClick={addChild}
              iconName="Plus"
              iconPosition="left"
              className="w-auto mt-6 mr-2 bg-card text-primary hover:bg-card/80 border border-primary"
            >
              Add Student
            </Button>
          </div>
        </div>
      )}

      {/* Checkboxes */}
      <div className="flex flex-col gap-2 mt-4">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={formData.termsAccepted || false}
          onChange={(checked) => onChange("termsAccepted", checked)}
        />
        <Checkbox
          label="I would like to receive marketing communications"
          checked={formData.marketingConsent || false}
          onChange={(checked) => onChange("marketingConsent", checked)}
        />
      </div>
    </div>
  );

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "student/parent":
      case "teacher":
      case "school":
        return renderCommonFields();
      default:
        return null;
    }
  };

  return <div className="space-y-6 mb-6">{renderRoleSpecificFields()}</div>;
};

export default RoleSpecificStep;
