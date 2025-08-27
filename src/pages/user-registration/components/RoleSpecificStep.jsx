import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RoleSpecificStep = ({ formData, errors, onChange }) => {
  const handleInputChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  const handleSelectChange = (field) => (value) => {
    onChange(field, value);
  };

  const gradeOptions = [
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' }
  ];

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' }
  ];

  const relationshipOptions = [
    { value: 'mother', label: 'Mother' },
    { value: 'father', label: 'Father' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'other', label: 'Other' }
  ];

  const renderStudentFields = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Student Information</h2>
        <p className="text-muted-foreground mt-2">
          Tell us about your academic level
        </p>
      </div>

      <Select
        label="Grade Level"
        options={gradeOptions}
        value={formData.gradeLevel}
        onChange={handleSelectChange('gradeLevel')}
        error={errors.gradeLevel}
        placeholder="Select your grade level"
        required
      />

      <Input
        label="Student ID (Optional)"
        type="text"
        placeholder="Enter your student ID if you have one"
        value={formData.studentId}
        onChange={handleInputChange('studentId')}
        error={errors.studentId}
        description="Leave blank if you don't have a student ID yet"
      />

      <Input
        label="School/Institution Name"
        type="text"
        placeholder="Enter your school or institution name"
        value={formData.institutionName}
        onChange={handleInputChange('institutionName')}
        error={errors.institutionName}
        required
      />
    </div>
  );

  const renderParentFields = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Parent Information</h2>
        <p className="text-muted-foreground mt-2">
          Provide details about your relationship with the student
        </p>
      </div>

      <Select
        label="Relationship to Student"
        options={relationshipOptions}
        value={formData.relationship}
        onChange={handleSelectChange('relationship')}
        error={errors.relationship}
        placeholder="Select your relationship"
        required
      />

      <Input
        label="Child's Full Name"
        type="text"
        placeholder="Enter your child's full name"
        value={formData.childName}
        onChange={handleInputChange('childName')}
        error={errors.childName}
        required
      />

      <Input
        label="Child's Student ID"
        type="text"
        placeholder="Enter your child's student ID"
        value={formData.childStudentId}
        onChange={handleInputChange('childStudentId')}
        error={errors.childStudentId}
        description="This helps us link your account to your child's records"
        required
      />

      <Input
        label="School/Institution Name"
        type="text"
        placeholder="Enter the school name"
        value={formData.institutionName}
        onChange={handleInputChange('institutionName')}
        error={errors.institutionName}
        required
      />
    </div>
  );

  const renderTeacherFields = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Teacher Information</h2>
        <p className="text-muted-foreground mt-2">
          Tell us about your teaching specialization
        </p>
      </div>

      <Select
        label="Primary Subject"
        options={subjectOptions}
        value={formData.primarySubject}
        onChange={handleSelectChange('primarySubject')}
        error={errors.primarySubject}
        placeholder="Select your primary subject"
        required
      />

      <Input
        label="Employee ID"
        type="text"
        placeholder="Enter your employee ID"
        value={formData.employeeId}
        onChange={handleInputChange('employeeId')}
        error={errors.employeeId}
        required
      />

      <Input
        label="Years of Experience"
        type="number"
        placeholder="Enter years of teaching experience"
        value={formData.experience}
        onChange={handleInputChange('experience')}
        error={errors.experience}
        min="0"
        max="50"
        required
      />

      <Input
        label="School/Institution Name"
        type="text"
        placeholder="Enter your school or institution name"
        value={formData.institutionName}
        onChange={handleInputChange('institutionName')}
        error={errors.institutionName}
        required
      />
    </div>
  );

  const renderAdminFields = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Administrator Information</h2>
        <p className="text-muted-foreground mt-2">
          Provide your administrative credentials
        </p>
      </div>

      <Input
        label="Institution Name"
        type="text"
        placeholder="Enter the institution name"
        value={formData.institutionName}
        onChange={handleInputChange('institutionName')}
        error={errors.institutionName}
        required
      />

      <Input
        label="Admin ID"
        type="text"
        placeholder="Enter your administrator ID"
        value={formData.adminId}
        onChange={handleInputChange('adminId')}
        error={errors.adminId}
        required
      />

      <Input
        label="Department"
        type="text"
        placeholder="Enter your department"
        value={formData.department}
        onChange={handleInputChange('department')}
        error={errors.department}
        required
      />

      <Input
        label="Institution Code"
        type="text"
        placeholder="Enter the institution code"
        value={formData.institutionCode}
        onChange={handleInputChange('institutionCode')}
        error={errors.institutionCode}
        description="This code is provided by your institution"
        required
      />
    </div>
  );

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'student':
        return renderStudentFields();
      case 'parent':
        return renderParentFields();
      case 'teacher':
        return renderTeacherFields();
      case 'admin':
        return renderAdminFields();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderRoleSpecificFields()}
    </div>
  );
};

export default RoleSpecificStep;