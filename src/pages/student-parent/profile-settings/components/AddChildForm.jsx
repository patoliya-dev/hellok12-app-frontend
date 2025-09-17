import React, { useState } from 'react';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';

const AddChildForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    age: '',
    gender: '',
    language: '',
    grade: '',
    profileImage: 'https://via.placeholder.com/150',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          required
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
        />
        <Input
          name="gender"
          label="Gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
        />
        <Input
          name="language"
          label="Languages"
          placeholder="Languages"
          value={formData.language}
          onChange={handleChange}
        />
        <Input
          name="grade"
          label="Grade"
          placeholder="Grade"
          value={formData.grade}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end space-x-3 mt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="default" onClick={handleSubmit}>Add Student</Button>
      </div>
    </div>
  );
};

export default AddChildForm;
