import React, { useState } from "react";
import Input from "components/ui/Input";
import Button from "components/ui/Button";
import Select from "components/ui/Select";
import { languageOptions } from "../../../../utils/utils";
import { cloneDeep, set } from "lodash";

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const AddChildForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    languages: [],
  });

  const languagesArray = formData?.languages ? formData.languages : [];

  const handleGenderChange = (value) =>
    setFormData((prev) => ({ ...prev, gender: value }));
  const handleLanguagesChange = (values) => {
    setFormData((prev) => ({
      ...prev,
      languages: [...values],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = cloneDeep(prev);
      set(updated, name, value);
      return updated;
    });
  };

  const handleSubmit = () => {
    onAdd(formData);
    onCancel();
  };

  return (
    <div className="p-6 rounded-lg border border-dashed mt-6">
      <h3 className="text-lg font-semibold mb-4">Add New Student Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="fullName"
          label="Full Name"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          label="Email Address"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <Input
          name="address"
          label="Address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="md:col-span-2"
        />
        <Input
          name="age"
          label="Age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          type="number"
          min={1}
          required
        />
        <Select
          label="Gender"
          value={formData.gender}
          options={GENDER_OPTIONS}
          onChange={handleGenderChange}
          required
        />
        <Select
          label="Languages"
          multiple
          value={languagesArray}
          options={languageOptions}
          onChange={handleLanguagesChange}
          searchable
          required
        />
      </div>
      <div className="flex justify-end space-x-3 mt-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSubmit}>
          Add Student
        </Button>
      </div>
    </div>
  );
};

export default AddChildForm;
