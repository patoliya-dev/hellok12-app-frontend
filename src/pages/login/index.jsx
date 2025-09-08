import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/LoginForm';
import SocialLoginSection from './components/SocialLoginSection';
import TrustSignals from './components/TrustSignals';
import logo from '../../assets/logo.svg';
import wavingHand from '../../assets/waving-hand.svg';
import UserRegistration from '../../pages/user-registration';
import { SignInIcon, SignUpIcon } from '../../components/icons';
import { loginUser } from 'features/auth/authThunks';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const [currentStep, setCurrentStep] = useState(0);

  const dispatch = useDispatch();
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
  // const mockCredentials = {
  //   'student@eduportal.com': { password: 'student123', role: 'student', mfaEnabled: false },
  //   'parent@eduportal.com': { password: 'parent123', role: 'parent', mfaEnabled: true },
  //   'teacher@eduportal.com': { password: 'teacher123', role: 'teacher', mfaEnabled: false },
  //   'admin@eduportal.com': { password: 'admin123', role: 'admin', mfaEnabled: true }
  // };

  const redirectToRoleDashboard = (role) => {
    const dashboardRoutes = {
      student: '/student-dashboard',
      parent: '/parent-dashboard',
      teacher: '/teacher-dashboard',
      school: '/school-dashboard'
    };
    navigate(dashboardRoutes[role] || '/student-dashboard', { replace: true });
  };

  const handleLogin = async (formData) => {

    const resultAction = await dispatch(loginUser(formData));
    console.log('resultAction', resultAction);

    if (loginUser.fulfilled.match(resultAction)) {
      // redirect to dashboard
      // navigate('/dashboard', { replace: true });
      const { user } = resultAction.payload;
      redirectToRoleDashboard(user.role)
    } else {
      // error is in state; optionally show toast here
      console.error('Login failed:', resultAction.payload || resultAction.error);
      // Capture error message
      const errorMessage =
        resultAction.payload?.error || resultAction.error?.message || "Login failed. Please try again.";
      setError(errorMessage);
    }
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

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || LoginForm;

  return (
    <div className="min-h-screen bg-auth-bg bg-cover bg-center">
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

          </div>

          {/* Trust Signals */}
          <TrustSignals />
        </div>
      </main>
    </div>
  );
};

export default Login;
