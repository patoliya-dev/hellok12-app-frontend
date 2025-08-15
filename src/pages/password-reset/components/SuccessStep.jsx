import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessStep = ({ resetInfo }) => {
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect to login
          window.location.href = '/login';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect]);

  const handleManualRedirect = () => {
    window.location.href = '/login';
  };

  const handleStayOnPage = () => {
    setAutoRedirect(false);
    setCountdown(0);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset Successful!</h1>
        <p className="text-muted-foreground">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
      </div>

      {/* Success Details */}
      <div className="bg-success/5 border border-success/20 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="User" size={16} color="var(--color-success)" />
            <div>
              <div className="text-sm font-medium text-foreground">Account</div>
              <div className="text-sm text-muted-foreground">{resetInfo.contact}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={16} color="var(--color-success)" />
            <div>
              <div className="text-sm font-medium text-foreground">Reset Time</div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={16} color="var(--color-success)" />
            <div>
              <div className="text-sm font-medium text-foreground">Security Status</div>
              <div className="text-sm text-muted-foreground">Password strength: Strong</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto Redirect Notice */}
      {autoRedirect && countdown > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Info" size={16} color="var(--color-primary)" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Auto Redirect</div>
              <div className="text-sm text-muted-foreground">
                Redirecting to login page in {countdown} seconds...
              </div>
            </div>
            <button
              onClick={handleStayOnPage}
              className="text-xs text-primary hover:text-primary/80 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 mb-8">
        <Button
          variant="default"
          onClick={handleManualRedirect}
          fullWidth
          iconName="LogIn"
          iconPosition="right"
        >
          Continue to Login
        </Button>

        <Button
          variant="outline"
          onClick={() => window.location.href = '/user-registration'}
          fullWidth
          iconName="UserPlus"
          iconPosition="left"
        >
          Create New Account
        </Button>
      </div>

      {/* Security Recommendations */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-foreground mb-2">Security Recommendations</div>
            <ul className="text-muted-foreground space-y-1">
              <li>• Sign out of all devices and sign back in with your new password</li>
              <li>• Enable two-factor authentication for added security</li>
              <li>• Review your account activity regularly</li>
              <li>• Update your password recovery information</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center space-x-2 p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
          <Icon name="Settings" size={16} />
          <span>Account Settings</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
          <Icon name="HelpCircle" size={16} />
          <span>Get Help</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-muted-foreground mb-2">
          Need assistance? Our support team is here to help.
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

export default SuccessStep;