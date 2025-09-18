import React, { useState } from 'react';
import Button from 'components/ui/Button';
import BasicInfoStep from './components/BasicInfoStep';
import RoleSpecificStep from './components/RoleSpecificStep';
import VerificationStep from './components/VerificationStep';
import LoginSignupProgress from './components/login-signup-progress';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from 'features/auth/authThunks';
import { selectSignupError, selectSignupStatus } from 'features/auth/authSelectors';

const UserRegistration = ({ currentStep, setCurrentStep }) => {
  const dispatch = useDispatch();
  // selectors
  const signupStatus = useSelector(selectSignupStatus);
  const signupError = useSelector(selectSignupError);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    userType: 'student', // Added userType selection for student/parent
    schoolName: '',
    children: [],
    termsAccepted: false,
    marketingConsent: false,
    password: '',
    confirmPassword: '',
    emailOTP: '',
    smsOTP: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value, childId = null) => {
    if (field === "children" && childId) {
      setFormData(prev => ({
        ...prev,
        children: prev.children.map(child =>
          child.id === childId ? { ...child, ...value } : child
        )
      }));

      Object.keys(value).forEach(key => {
        const errorKey = `${key}_${childId}`;
        if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: "" }));
      });
    } else if (field === "clearError") {
      setErrors(prev => ({ ...prev, [value]: "" }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setCurrentStep(1);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.role) newErrors.role = "Please select a role";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";

      // Role-specific validation
      if (formData.role === "student/parent") {
        if (!formData.userType) newErrors.userType = "Please select student or parent";

        if (formData.userType === "parent") {
          if (!formData.children || !formData.children.length) {
            newErrors.children = "Please add at least one student";
          } else {
            formData.children.forEach((child) => {
              if (!child.name?.trim()) newErrors[`name_${child.id}`] = "Name is required";
              if (!child.age) newErrors[`age_${child.id}`] = "Age is required";
              if (!child.gender) newErrors[`gender_${child.id}`] = "Gender is required";
            });
          }
        }
      }

      if (formData.role === "school") {
        if (!formData.schoolName?.trim()) newErrors.schoolName = "School name is required";
      }
    }

    if (step === 3) {
      if (!formData.emailOTP?.trim() || formData.emailOTP.length !== 6) newErrors.emailOTP = "Enter valid 6-digit OTP";
      if (!formData.smsOTP?.trim() || formData.smsOTP.length !== 6) newErrors.smsOTP = "Enter valid 6-digit OTP";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        console.log('Sending OTP codes to:', formData.email, formData.phone);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => setCurrentStep(prev => prev - 1);

  const handleResendOTP = (type) => console.log(`Resending ${type} OTP`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Run validation before submission
    if (!validateStep(2)) return;

    // Make sure payload is clean JSON
    const payload = {
      ...formData,
      role: formData.role === 'student/parent' ? formData.userType : formData.role,
      children: (formData.children || []).map(child => ({
        id: child.id,
        name: child.name || "",
        age: child.age || "",
        gender: child.gender || ""
      }))
    };

    console.log('Submitting signup with payload:', payload);

    const resultAction = await dispatch(signupUser(payload));

    if (signupUser.fulfilled.match(resultAction)) {
      console.log('Signup successful:', resultAction.payload);
      handleNext();
    }

  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
      case 1:
        return (
          <>
            <LoginSignupProgress currentStep={currentStep} />
            <BasicInfoStep
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onRoleSelect={handleRoleSelect}
            />
            <Button
              variant="default"
              onClick={handleNext}
              iconName="ChevronRight"
              iconPosition="right"
              className="w-full mt-6"
            >
              Continue
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <LoginSignupProgress currentStep={currentStep} />
            <form onSubmit={handleSubmit}>
              <div className='px-1 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-10'>

                <RoleSpecificStep
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="default"
                  onClick={handlePrevious}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="w-full mt-6 mr-2 bg-muted text-foreground hover:bg-muted/80"
                >
                  Back
                </Button>
                <Button
                  variant="default"
                  loading={signupStatus === 'loading'}
                  disabled={signupStatus === 'loading'}
                  type="submit"
                  iconPosition="right"
                  className="w-full mt-6"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </>
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
    <div className="bg-background p-6">
      {renderCurrentStep()}
      {signupError && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-error">{signupError}</p>
        </div>
      )}
    </div>
  );
};

export default UserRegistration;
