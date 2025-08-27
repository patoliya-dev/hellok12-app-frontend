import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OTPVerificationStep = ({ verificationInfo, onNext, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  // Mock correct OTP for demo
  const correctOTP = '123456';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty field or last field
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API verification
    setTimeout(() => {
      setLoading(false);
      if (otpString === correctOTP) {
        onNext({ ...verificationInfo, otp: otpString });
      } else {
        setError('Invalid verification code. Please try again.');
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResend = async () => {
    setResendLoading(true);
    
    // Simulate resend API call
    setTimeout(() => {
      setResendLoading(false);
      setCanResend(false);
      setTimeLeft(600); // Reset timer
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    }, 2000);
  };

  const getContactDisplay = () => {
    const contact = verificationInfo.contact;
    if (verificationInfo.verificationMethod === 'email' || verificationInfo.verificationMethod === 'backup_email') {
      return contact.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    } else {
      return contact.replace(/(\+?\d{2})(\d*)(\d{4})/, '$1***$3');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="MessageSquare" size={24} color="var(--color-warning)" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Enter Verification Code</h1>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to <span className="font-medium text-foreground">{getContactDisplay()}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Verification Code</label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-smooth
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  ${error 
                    ? 'border-error bg-error/5 text-error' :'border-border bg-input text-foreground hover:border-primary/50'
                  }
                `}
                autoComplete="one-time-code"
              />
            ))}
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-sm text-error">
              <Icon name="AlertCircle" size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Timer and Resend */}
        <div className="text-center space-y-3">
          {timeLeft > 0 ? (
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>Code expires in {formatTime(timeLeft)}</span>
            </div>
          ) : (
            <div className="text-sm text-error">
              Verification code has expired
            </div>
          )}

          <div>
            {canResend || timeLeft === 0 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                loading={resendLoading}
                iconName="RefreshCw"
                iconPosition="left"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Button>
            ) : (
              <span className="text-sm text-muted-foreground">
                Resend available in {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            loading={loading}
            disabled={otp.join('').length !== 6}
            fullWidth
            iconName="Check"
            iconPosition="right"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            fullWidth
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back
          </Button>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-8 bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="HelpCircle" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground mb-1">Didn't receive the code?</div>
            <ul className="text-muted-foreground space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Ensure you have network connectivity</li>
              <li>• Wait a few minutes and try resending</li>
              <li>• Contact support if issues persist</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="text-xs text-primary font-medium mb-1">Demo Credentials:</div>
        <div className="text-xs text-primary">Verification Code: {correctOTP}</div>
      </div>
    </div>
  );
};

export default OTPVerificationStep;