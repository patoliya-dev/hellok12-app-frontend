import React from 'react';
import Input from '../../../components/ui/Input';
import RoleSelectionCard from './RoleSelectionCard';

const BasicInfoStep = ({ formData, errors, onChange, onRoleSelect }) => {
  const handleInputChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-muted-foreground mt-2">
          Let's start with your basic information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleInputChange('firstName')}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleInputChange('lastName')}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={errors.email}
        description="We'll send verification code to this email"
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={handleInputChange('phone')}
        error={errors.phone}
        description="We'll send SMS verification code to this number"
        required
      /> */}

      {/* <div className="space-y-4"> */}
        {/* <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Select Your Role</h3>
          <p className="text-sm text-muted-foreground">
            Choose the role that best describes you
          </p>
        </div> */}
        <>
        <div className="flex gap-[10px]">
          {['student/parent', 'teacher', 'school'].map((role) => (
            <RoleSelectionCard
              key={role}
              role={role}
              isSelected={formData.role === role}
              onSelect={onRoleSelect}
            />
          ))}
        </div>
        {errors.role && (
          <p className="text-sm text-error mt-2">{errors.role}</p>
        )}
        </>
      {/* </div> */}

    </div>
  );
};

export default BasicInfoStep;