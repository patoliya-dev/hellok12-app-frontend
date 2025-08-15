import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MFAPrompt = ({ isVisible, onVerify, onResend, isLoading, error }) => {
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResend = () => {
    onResend();
    setResendTimer(30);
    setOtpCode('');
  };

  if (!isVisible) return null;

  return (
    <div className="mt-6 p-6 bg-muted/30 border border-border rounded-lg">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Smartphone" size={24} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the 6-digit code sent to your registered device
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
        )}

        <Input
          label="Verification Code"
          type="text"
          placeholder="000000"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          required
          disabled={isLoading}
          className="text-center text-lg tracking-widest"
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Didn't receive code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || isLoading}
            className="text-primary hover:text-primary/80 transition-smooth disabled:text-muted-foreground"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
          </button>
        </div>

        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          fullWidth
          disabled={otpCode.length !== 6}
        >
          Verify & Continue
        </Button>
      </form>
    </div>
  );
};

export default MFAPrompt;