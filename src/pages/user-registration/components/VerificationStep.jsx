import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VerificationStep = ({ formData, errors, onChange, onResendOTP }) => {
  const [emailTimer, setEmailTimer] = useState(0);
  const [smsTimer, setSmsTimer] = useState(0);

  useEffect(() => {
    let emailInterval;
    let smsInterval;

    if (emailTimer > 0) {
      emailInterval = setInterval(() => {
        setEmailTimer(prev => prev - 1);
      }, 1000);
    }

    if (smsTimer > 0) {
      smsInterval = setInterval(() => {
        setSmsTimer(prev => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(emailInterval);
      clearInterval(smsInterval);
    };
  }, [emailTimer, smsTimer]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(field, value);
  };

  const handleResendEmail = () => {
    onResendOTP('email');
    setEmailTimer(60);
  };

  const handleResendSMS = () => {
    onResendOTP('sms');
    setSmsTimer(60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Verify Your Account</h2>
        <p className="text-muted-foreground mt-2">
          We've sent verification codes to secure your account
        </p>
      </div>

      {/* Email Verification */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Mail" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Email Verification</h3>
            <p className="text-sm text-muted-foreground">
              Code sent to {formData.email}
            </p>
          </div>
        </div>

        <Input
          label="Email OTP"
          type="text"
          placeholder="Enter 6-digit code"
          value={formData.emailOTP}
          onChange={handleInputChange('emailOTP')}
          error={errors.emailOTP}
          maxLength="6"
          required
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          {emailTimer > 0 ? (
            <span className="text-sm text-muted-foreground">
              Resend in {formatTime(emailTimer)}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendEmail}
            >
              Resend Code
            </Button>
          )}
        </div>
      </div>

      {/* SMS Verification */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Smartphone" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">SMS Verification</h3>
            <p className="text-sm text-muted-foreground">
              Code sent to {formData.phone}
            </p>
          </div>
        </div>

        <Input
          label="SMS OTP"
          type="text"
          placeholder="Enter 6-digit code"
          value={formData.smsOTP}
          onChange={handleInputChange('smsOTP')}
          error={errors.smsOTP}
          maxLength="6"
          required
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          {smsTimer > 0 ? (
            <span className="text-sm text-muted-foreground">
              Resend in {formatTime(smsTimer)}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendSMS}
            >
              Resend Code
            </Button>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} color="var(--color-warning)" />
          <div>
            <h4 className="font-medium text-foreground">Security Notice</h4>
            <p className="text-sm text-muted-foreground mt-1">
              For your security, verification codes expire in 10 minutes. 
              Don't share these codes with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStep;