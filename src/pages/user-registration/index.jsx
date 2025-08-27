import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import RegistrationHeader from './components/RegistrationHeader';
import SocialLoginSection from './components/SocialLoginSection';
import ProgressIndicator from './components/ProgressIndicator';
import BasicInfoStep from './components/BasicInfoStep';
import RoleSpecificStep from './components/RoleSpecificStep';
import VerificationStep from './components/VerificationStep';
import TrustSignals from './components/TrustSignals';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    
    // Role-specific fields
    gradeLevel: '',
    studentId: '',
    institutionName: '',
    relationship: '',
    childName: '',
    childStudentId: '',
    primarySubject: '',
    employeeId: '',
    experience: '',
    adminId: '',
    department: '',
    institutionCode: '',
    
    // Verification
    emailOTP: '',
    smsOTP: ''
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.role) newErrors.role = 'Please select a role';
    }

    if (step === 2) {
      if (formData.role === 'student') {
        if (!formData.gradeLevel) newErrors.gradeLevel = 'Grade level is required';
        if (!formData.institutionName.trim()) newErrors.institutionName = 'Institution name is required';
      } else if (formData.role === 'parent') {
        if (!formData.relationship) newErrors.relationship = 'Relationship is required';
        if (!formData.childName.trim()) newErrors.childName = 'Child\'s name is required';
        if (!formData.childStudentId.trim()) newErrors.childStudentId = 'Child\'s student ID is required';
        if (!formData.institutionName.trim()) newErrors.institutionName = 'Institution name is required';
      } else if (formData.role === 'teacher') {
        if (!formData.primarySubject) newErrors.primarySubject = 'Primary subject is required';
        if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
        if (!formData.institutionName.trim()) newErrors.institutionName = 'Institution name is required';
      } else if (formData.role === 'admin') {
        if (!formData.institutionName.trim()) newErrors.institutionName = 'Institution name is required';
        if (!formData.adminId.trim()) newErrors.adminId = 'Admin ID is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.institutionCode.trim()) newErrors.institutionCode = 'Institution code is required';
      }
    }

    if (step === 3) {
      if (!formData.emailOTP.trim() || formData.emailOTP.length !== 6) {
        newErrors.emailOTP = 'Please enter valid 6-digit email OTP';
      }
      if (!formData.smsOTP.trim() || formData.smsOTP.length !== 6) {
        newErrors.smsOTP = 'Please enter valid 6-digit SMS OTP';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
    
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        // Send OTP codes when moving to verification step
        console.log('Sending OTP codes to:', formData.email, formData.phone);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Mock social login - redirect to appropriate dashboard
    const dashboardRoutes = {
      student: '/student-dashboard',
      parent: '/parent-dashboard',
      teacher: '/teacher-dashboard',
      admin: '/admin-dashboard'
    };
    
    // For demo, assume student role for social login
    navigate('/student-dashboard');
  };

  const handleResendOTP = (type) => {
    console.log(`Resending ${type} OTP`);
    // Mock OTP resend logic
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    
    try {
      // Mock registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration successful:', formData);
      
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes = {
        student: '/student-dashboard',
        parent: '/parent-dashboard',
        teacher: '/teacher-dashboard',
        admin: '/admin-dashboard'
      };
      
      navigate(dashboardRoutes[formData.role] || '/student-dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onRoleSelect={handleRoleSelect}
          />
        );
      case 2:
        return (
          <RoleSpecificStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 3:
        return (
          <VerificationStep
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onResendOTP={handleResendOTP}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background">
      {/* <RegistrationHeader /> */}
      
      {/* <main className="pt-16"> */}
        <div className="max-w-7xl mx-auto">
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
            {/* Main Registration Form */}
            {/* <div className="lg:col-span-1"> */}
              {/* <div className="bg-surface rounded-lg shadow-subtle border border-border p-6 sm:p-8"> */}
                {currentStep === 1 && (
                  <>
                    {/* <SocialLoginSection onSocialLogin={handleSocialLogin} /> */}
                    {/* <div className="mt-8"> */}
                      {/* <ProgressIndicator currentStep={currentStep} totalSteps={3} /> */}
                      {renderCurrentStep()}
                    {/* </div> */}
                  </>
                )}
                
                {currentStep > 1 && (
                  <>
                    <ProgressIndicator currentStep={currentStep} totalSteps={3} />
                    {renderCurrentStep()}
                  </>
                )}

                {/* Navigation Buttons */}
                {/* <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      iconName="ChevronLeft"
                      iconPosition="left"
                      className="sm:w-auto"
                    >
                      Previous
                    </Button>
                  )}
                  
                  <div className="flex-1" />
                  
                  {currentStep < 3 ? (
                    <Button
                      variant="default"
                      onClick={handleNext}
                      iconName="ChevronRight"
                      iconPosition="right"
                      className="sm:w-auto"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={handleSubmit}
                      loading={loading}
                      iconName="Check"
                      iconPosition="left"
                      className="sm:w-auto"
                    >
                      Complete Registration
                    </Button>
                  )}
                </div> */}

                {errors.submit && (
                  <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
                    <p className="text-sm text-error">{errors.submit}</p>
                  </div>
                )}
              {/* </div> */}

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    className="text-primary hover:text-primary/80 font-medium transition-smooth"
                  >
                    Sign in here 
                  </a>
                </p>
              </div>
            {/* </div> */}

            {/* Trust Signals Sidebar */}
            {/* <div className="lg:col-span-1">
              <TrustSignals />
            </div> */}
          </div>
        {/* </div> */}
      {/* </main> */}
    </div>
  );
};

export default UserRegistration;