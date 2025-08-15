import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AccountInfoStep = ({ onNext, onBack }) => {
  const [contactMethod, setContactMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (contactMethod === 'email') {
      if (!email) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onNext({ 
        contactMethod, 
        contact: contactMethod === 'email' ? email : phone 
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Lock" size={24} color="var(--color-primary)" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Reset Your Password</h1>
        <p className="text-muted-foreground">
          Enter your email address or phone number and we'll help you reset your password securely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">How would you like to reset your password?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setContactMethod('email')}
              className={`
                p-4 rounded-lg border-2 transition-smooth text-left
                ${contactMethod === 'email' ?'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name="Mail" size={20} className="mb-2" />
              <div className="text-sm font-medium">Email</div>
              <div className="text-xs opacity-75">Reset via email</div>
            </button>
            
            <button
              type="button"
              onClick={() => setContactMethod('phone')}
              className={`
                p-4 rounded-lg border-2 transition-smooth text-left
                ${contactMethod === 'phone' ?'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name="Phone" size={20} className="mb-2" />
              <div className="text-sm font-medium">SMS</div>
              <div className="text-xs opacity-75">Reset via SMS</div>
            </button>
          </div>
        </div>

        {/* Contact Input */}
        {contactMethod === 'email' ? (
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            className="w-full"
          />
        ) : (
          <Input
            type="tel"
            label="Phone Number"
            placeholder="Enter your registered phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            required
            className="w-full"
          />
        )}

        {/* Security Notice */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-foreground mb-1">Security Notice</div>
              <div className="text-muted-foreground">
                We'll send a verification code to confirm your identity. This helps keep your account secure.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            loading={loading}
            fullWidth
            iconName="ArrowRight"
            iconPosition="right"
          >
            {loading ? 'Verifying...' : 'Continue'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => window.location.href = '/login'}
              className="text-sm text-primary hover:text-primary/80 transition-smooth"
            >
              Back to Login
            </button>
          </div>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-8 text-center">
        <div className="text-sm text-muted-foreground mb-2">
          Need help? Contact our support team
        </div>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <a href="mailto:support@eduportal.com" className="text-primary hover:text-primary/80 transition-smooth">
            support@eduportal.com
          </a>
          <span className="text-border">|</span>
          <a href="tel:+1-800-EDU-HELP" className="text-primary hover:text-primary/80 transition-smooth">
            1-800-EDU-HELP
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoStep;