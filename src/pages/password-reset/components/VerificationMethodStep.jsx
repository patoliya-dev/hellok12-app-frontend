import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VerificationMethodStep = ({ contactInfo, onNext, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const methods = [
    {
      id: 'email',
      icon: 'Mail',
      title: 'Email Verification',
      description: `Send code to ${contactInfo.contact}`,
      estimatedTime: '2-5 minutes',
      available: contactInfo.contactMethod === 'email'
    },
    {
      id: 'sms',
      icon: 'MessageSquare',
      title: 'SMS Verification',
      description: `Send code to ${contactInfo.contact}`,
      estimatedTime: '1-2 minutes',
      available: contactInfo.contactMethod === 'phone'
    },
    {
      id: 'backup_email',
      icon: 'Mail',
      title: 'Backup Email',
      description: 'Send code to your backup email',
      estimatedTime: '2-5 minutes',
      available: true
    }
  ];

  const availableMethods = methods.filter(method => method.available);

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleContinue = async () => {
    if (!selectedMethod) return;

    setLoading(true);
    
    // Simulate sending verification code
    setTimeout(() => {
      setLoading(false);
      onNext({ 
        verificationMethod: selectedMethod,
        ...contactInfo
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Shield" size={24} color="var(--color-success)" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Choose Verification Method</h1>
        <p className="text-muted-foreground">
          Select how you'd like to receive your verification code to reset your password.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {availableMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => handleMethodSelect(method.id)}
            className={`
              w-full p-4 rounded-lg border-2 transition-smooth text-left
              ${selectedMethod === method.id 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${selectedMethod === method.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                <Icon name={method.icon} size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-foreground">{method.title}</h3>
                  {selectedMethod === method.id && (
                    <Icon name="CheckCircle" size={16} color="var(--color-primary)" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} />
                  <span>Delivery: {method.estimatedTime}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Security Tips */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground mb-1">Security Tips</div>
            <ul className="text-muted-foreground space-y-1">
              <li>• Check your spam/junk folder if you don't receive the code</li>
              <li>• The verification code will expire in 10 minutes</li>
              <li>• You can request a new code if needed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          onClick={handleContinue}
          disabled={!selectedMethod}
          loading={loading}
          fullWidth
          iconName="Send"
          iconPosition="right"
        >
          {loading ? 'Sending Code...' : 'Send Verification Code'}
        </Button>

        <Button
          variant="outline"
          onClick={onBack}
          fullWidth
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back
        </Button>
      </div>

      {/* Alternative Options */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Can't access any of these methods?
        </p>
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
          Contact Support for Account Recovery
        </button>
      </div>
    </div>
  );
};

export default VerificationMethodStep;