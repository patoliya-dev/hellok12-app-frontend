import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import AuthenticationHeader from '../../components/ui/AuthenticationHeader';
import LoginForm from './components/LoginForm';
import SocialLoginSection from './components/SocialLoginSection';
import MFAPrompt from './components/MFAPrompt';
import TrustSignals from './components/TrustSignals';
import Icon from '../../components/AppIcon';
import logo from '../../assets/logo.svg';
import wavingHand from '../../assets/waving-hand.svg';
import UserRegistration from '../../pages/user-registration';
import { SignInIcon, SignUpIcon } from '../../components/icons';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMFA, setShowMFA] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('signin');
  const [currentStep, setCurrentStep] = useState(0);

  const tabs = [{
    id: 'signin',
    label: 'Sign In',
    icon: SignInIcon,
    component: LoginForm
  },
  {
    id: 'signup',
    label: 'Sign Up',
    icon: SignUpIcon,
    component: UserRegistration
  }];

  // Mock credentials for different user roles
  const mockCredentials = {
    'student@eduportal.com': { password: 'student123', role: 'student', mfaEnabled: false },
    'parent@eduportal.com': { password: 'parent123', role: 'parent', mfaEnabled: true },
    'teacher@eduportal.com': { password: 'teacher123', role: 'teacher', mfaEnabled: false },
    'admin@eduportal.com': { password: 'admin123', role: 'admin', mfaEnabled: true }
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      redirectToRoleDashboard(user.role);
    }
  }, []);

  const redirectToRoleDashboard = (role) => {
    const dashboardRoutes = {
      student: '/student-dashboard',
      parent: '/parent-dashboard',
      teacher: '/teacher-dashboard',
      admin: '/admin-dashboard'
    };
    navigate(dashboardRoutes[role] || '/student-dashboard');
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const user = mockCredentials[formData.email.toLowerCase()];

      if (!user || user.password !== formData.password) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }

      const userData = {
        email: formData.email,
        role: user.role,
        name: getDisplayName(user.role),
        mfaEnabled: user.mfaEnabled,
        loginTime: new Date().toISOString()
      };

      setCurrentUser(userData);

      if (user.mfaEnabled) {
        setShowMFA(true);
      } else {
        // Save user session
        localStorage.setItem('currentUser', JSON.stringify(userData));
        if (formData.rememberMe) {
          localStorage.setItem('rememberUser', formData.email);
        }
        redirectToRoleDashboard(user.role);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerify = async (otpCode) => {
    setIsLoading(true);
    setMfaError('');

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock OTP validation (accept 123456 as valid)
      if (otpCode !== '123456') {
        throw new Error('Invalid verification code. Please try again.');
      }

      // Save user session after successful MFA
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      redirectToRoleDashboard(currentUser.role);
    } catch (err) {
      setMfaError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAResend = async () => {
    // Simulate resend OTP
    console.log('Resending OTP...');
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful social login as student
      const userData = {
        email: `${provider.toLowerCase()}user@eduportal.com`,
        role: 'student',
        name: `${provider} User`,
        mfaEnabled: false,
        loginTime: new Date().toISOString(),
        socialProvider: provider
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      redirectToRoleDashboard('student');
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = (role) => {
    const names = {
      student: 'John Smith',
      parent: 'Sarah Johnson',
      teacher: 'Dr. Michael Brown',
      admin: 'Administrator'
    };
    return names[role] || 'User';
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || LoginForm;

  return (
    <div className="min-h-screen bg-background" style={{ backgroundImage: "url('/src/assets/auth/bg.png')" }}>
      <main className="pt-16 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <img src={logo} alt="Company Logo" className='mx-auto' />
            {activeTab == 'signin' ? (<div className="flex justify-center">
              <h1 className="text-xl font-bold text-foreground">Welcome Back!</h1>
              <img src={wavingHand} alt="Company Logo" className='ml-1' />
            </div>) : (<div className="flex justify-center">
              <h1 className="text-xl font-bold text-foreground">Join HelloK12</h1>
            </div>)}

            <p className="mt-2 text-muted-foreground">
              {activeTab == 'signin' ? 'Sign in to continue your learning journey' : 'Create your account to get started'}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-xl shadow-elevated">
            {!showMFA ? (
              <>

                <div className="border-b border-border">
                  <nav className="flex space-x-8">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (

                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id)
                            setCurrentStep(0);
                          }}
                          className={`
                            flex flex-1 justify-center text-center items-center space-x-2 py-[18px] px-1 border-b-2 font-medium text-sm transition-smooth
                            ${activeTab === tab.id
                              ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                            }
                          `}
                        >
                          <IconComponent selected={activeTab === tab.id} />
                          <span className='text-sm'>{tab.label}</span>
                        </button>
                      );
                    }
                    )}
                  </nav>
                </div>


                {/* Login Form */}
                <ActiveComponent
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  error={error}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                />

                {/* Social Login Section */}
                {!currentStep ? <SocialLoginSection
                  onGoogleLogin={() => handleSocialLogin('Google')}
                  onFacebookLogin={() => handleSocialLogin('Facebook')}
                  isLoading={isLoading}
                /> : null}
              </>
            ) : (
              /* MFA Prompt */
              <MFAPrompt
                isVisible={showMFA}
                onVerify={handleMFAVerify}
                onResend={handleMFAResend}
                isLoading={isLoading}
                error={mfaError}
              />
            )}

          </div>

          {/* Trust Signals */}
          <TrustSignals />

          {/* Demo Credentials Info */}
          {/* <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Student:</strong> student@eduportal.com / student123</p>
              <p><strong>Parent:</strong> parent@eduportal.com / parent123 (MFA: 123456)</p>
              <p><strong>Teacher:</strong> teacher@eduportal.com / teacher123</p>
              <p><strong>Admin:</strong> admin@eduportal.com / admin123 (MFA: 123456)</p>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Login;