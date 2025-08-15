import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} />
          <span>SSL Secured</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={14} />
          <span>256-bit Encryption</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={14} />
          <span>FERPA Compliant</span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary hover:text-primary/80 transition-smooth">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:text-primary/80 transition-smooth">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;