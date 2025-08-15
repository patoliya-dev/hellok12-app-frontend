import React, { useState } from 'react';
import PasswordResetHeader from './components/PasswordResetHeader';
import StepIndicator from './components/StepIndicator';
import AccountInfoStep from './components/AccountInfoStep';
import VerificationMethodStep from './components/VerificationMethodStep';
import OTPVerificationStep from './components/OTPVerificationStep';
import NewPasswordStep from './components/NewPasswordStep';
import SuccessStep from './components/SuccessStep';

const PasswordReset = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resetData, setResetData] = useState({});

  const totalSteps = 4;

  const handleStepNext = (stepData) => {
    setResetData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, totalSteps + 1));
  };

  const handleStepBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountInfoStep
            onNext={handleStepNext}
            onBack={handleStepBack}
          />
        );
      case 2:
        return (
          <VerificationMethodStep
            contactInfo={resetData}
            onNext={handleStepNext}
            onBack={handleStepBack}
          />
        );
      case 3:
        return (
          <OTPVerificationStep
            verificationInfo={resetData}
            onNext={handleStepNext}
            onBack={handleStepBack}
          />
        );
      case 4:
        return (
          <NewPasswordStep
            verificationInfo={resetData}
            onNext={handleStepNext}
            onBack={handleStepBack}
          />
        );
      case 5:
        return (
          <SuccessStep
            resetInfo={resetData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PasswordResetHeader />
      
      <main className="pt-16">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {/* Step Indicator - Hide on success step */}
            {currentStep <= totalSteps && (
              <div className="mb-8">
                <StepIndicator 
                  currentStep={currentStep} 
                  totalSteps={totalSteps} 
                />
              </div>
            )}

            {/* Step Content */}
            <div className="bg-surface rounded-2xl shadow-elevated border border-border p-6 md:p-8">
              {renderCurrentStep()}
            </div>

            {/* Trust Indicators */}
            {currentStep <= totalSteps && (
              <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>FERPA Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PasswordReset;