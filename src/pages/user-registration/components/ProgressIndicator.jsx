import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Basic Info', description: 'Personal details' },
    { number: 2, title: 'Role Details', description: 'Specific information' },
    { number: 3, title: 'Verification', description: 'Email & SMS OTP' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-smooth
                ${currentStep > step.number 
                  ? 'bg-success border-success text-success-foreground' 
                  : currentStep === step.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-surface border-border text-muted-foreground'
                }
              `}>
                {currentStep > step.number ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition-smooth
                ${currentStep > step.number ? 'bg-success' : 'bg-border'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;