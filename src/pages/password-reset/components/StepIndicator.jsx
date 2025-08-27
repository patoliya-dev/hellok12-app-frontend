import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Account Info', description: 'Enter email or phone' },
    { number: 2, title: 'Verification Method', description: 'Choose verification' },
    { number: 3, title: 'Enter Code', description: 'Verify identity' },
    { number: 4, title: 'New Password', description: 'Create password' }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className={`
              relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth
              ${currentStep >= step.number 
                ? 'bg-primary border-primary text-primary-foreground' 
                : currentStep === step.number - 1
                ? 'bg-primary/10 border-primary text-primary' :'bg-muted border-border text-muted-foreground'
              }
            `}>
              {currentStep > step.number ? (
                <Icon name="Check" size={16} />
              ) : (
                <span className="text-sm font-medium">{step.number}</span>
              )}
            </div>

            {/* Step Info - Hidden on mobile */}
            <div className="hidden md:block ml-3">
              <div className={`
                text-sm font-medium
                ${currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {step.description}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition-smooth
                ${currentStep > step.number ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Info */}
      <div className="md:hidden mt-4 text-center">
        <div className="text-sm font-medium text-foreground">
          {steps[currentStep - 1]?.title}
        </div>
        <div className="text-xs text-muted-foreground">
          {steps[currentStep - 1]?.description}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;