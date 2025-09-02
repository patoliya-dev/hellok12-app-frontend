import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useNavigate } from "react-router-dom";

const AccountInfoStep = ({ onNext }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const backToLogin = () => {
    navigate("/login"); // Redirect to /login
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
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
        contactMethod: "email",
        contact: email
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-left mb-8">
        <Button
          variant="default"
          onClick={backToLogin}
          iconName="ChevronLeft"
          iconPosition="left"
          className="p-0 bg-transparent text-foreground hover:bg-muted/80"
        >
          Back to Login
        </Button>

        {/* <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Lock" size={24} color="var(--color-primary)" />
        </div> */}
        <h1 className="text-2xl font-bold text-foreground mb-2">Forgot your password?</h1>
        <p className="text-muted-foreground">
          Don’t worry, happens to all of us. Enter your email below to recover your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Contact Input */}
        <Input
          type="email"
          label="Email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
          className="w-full"
        />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            loading={loading}
            fullWidth
          >
            {loading ? 'Verifying...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountInfoStep;