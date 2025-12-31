import { useState, useEffect } from 'react'; // Add useEffect import
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import authService from '../services/authService.ts';
import {
  Compass,
  Sparkles,
  Star,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  ChevronRight,
  LogIn,
  UserPlus,
  Key,
} from 'lucide-react';
import Background from '../components/Background';

type Status = { type: 'success' | 'error'; message: string } | null;

const SignupPage = () => {
  const navigate = useNavigate(); // Add navigate hook
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false); // Add redirecting state

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [verifyOtpData, setVerifyOtpData] = useState({
    email: '',
    otp: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // ADD THIS: Redirect if already authenticated with delay and message
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setRedirecting(true);
      setStatus({
        type: 'success',
        message: 'You are already logged in. Moving to home page...'
      });
      
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000); // 1 second delay
      
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const handle = async (key: string, fn: () => Promise<unknown>) => {
    setStatus(null);
    setLoading(key);
    try {
      await fn();
      if (key === 'verifyOtp') {
        setStatus({ type: 'success', message: 'Account created successfully! Redirecting to login...' });
        // Reset form
        setRegisterData({ name: '', email: '', password: '' });
        setVerifyOtpData({ email: '', otp: '' });
        setOtpSent(false);
      } else if (key === 'registerOtp') {
        setStatus({ type: 'success', message: 'OTP sent to your email. Please check and verify.' });
        setVerifyOtpData(prev => ({ ...prev, email: registerData.email }));
        setOtpSent(true);
      }
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : err instanceof Error
            ? err.message
            : undefined;
      setStatus({ type: 'error', message: msg ?? 'Request failed' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <Background intensity="medium" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-gray-900/80 border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-md opacity-70"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                NaviRiti
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ pointerEvents: redirecting ? 'none' : 'auto' }}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="flex items-center text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ pointerEvents: redirecting ? 'none' : 'auto' }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Begin Your Cosmic Journey
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Create Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Celestial Account
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Unlock personalized career guidance powered by AI and ancient cosmic wisdom
            </p>
          </div>

          {/* Main Content */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 rounded-3xl blur-2xl"></div>
            
            <div className="relative backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <div className="grid md:grid-cols-2">
                {/* Left - CTA */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-emerald-900/30 border-r border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-white/10 mb-4">
                      <LogIn className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white">
                      Already a <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Cosmic Traveler</span>?
                    </h2>
                    
                    <p className="text-gray-300 max-w-md">
                      Welcome back to your celestial career journey. Sign in to continue exploring your personalized career galaxy.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Resume Your Career Exploration</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Access Your Cosmic Roadmap</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Track Your Progress</span>
                      </div>
                    </div>
                    
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-8 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ pointerEvents: redirecting ? 'none' : 'auto' }}
                    >
                      <LogIn className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Sign In to Your Account
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-6 right-6 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-10 left-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-12 left-12 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>

                {/* Right - Signup Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      <UserPlus className="inline w-7 h-7 mr-3 text-purple-400" />
                      Create Account
                    </h2>
                    <p className="text-gray-400">Secure registration with OTP verification</p>
                  </div>

                  {status && (
                    <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm border ${
                      status.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                      <div className="flex items-center">
                        {status.type === 'success' ? (
                          redirecting ? (
                            <div className="w-5 h-5 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin mr-3"></div>
                          ) : (
                            <CheckCircle className="w-5 h-5 mr-2" />
                          )
                        ) : (
                          <Shield className="w-5 h-5 mr-2" />
                        )}
                        <span className={redirecting ? 'animate-pulse' : ''}>
                          {status.message}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Registration Form */}
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="inline w-4 h-4 mr-2" />
                        Full Name
                      </label>
                      <input
                        className="w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData((p) => ({ ...p, name: e.target.value }))}
                        disabled={otpSent || redirecting}
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        className="w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="your.email@example.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData((p) => ({ ...p, email: e.target.value }))
                        }
                        disabled={otpSent || redirecting}
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Lock className="inline w-4 h-4 mr-2" />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Create a strong password"
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData((p) => ({ ...p, password: e.target.value }))
                          }
                          disabled={otpSent || redirecting}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={otpSent || redirecting}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Send OTP Button */}
                    {!otpSent && (
                      <button
                        className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={
                          loading === 'registerOtp' ||
                          !registerData.email ||
                          !registerData.password ||
                          !registerData.name ||
                          redirecting
                        }
                        onClick={() =>
                          handle('registerOtp', () => authService.registerOtp(registerData))
                        }
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/20 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="relative flex items-center justify-center">
                          {loading === 'registerOtp' ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                              Sending OTP...
                            </>
                          ) : (
                            <>
                              <Key className="w-5 h-5 mr-2" />
                              Send Verification OTP
                            </>
                          )}
                        </span>
                      </button>
                    )}

                    {/* OTP Verification Section */}
                    {otpSent && (
                      <>
                        <div className="pt-6 border-t border-white/10">
                          <div className="flex items-center mb-4">
                            <Shield className="w-5 h-5 text-emerald-400 mr-2" />
                            <h3 className="text-lg font-semibold text-white">Verify Your Email</h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="group">
                              <input
                                className="w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Verify Email"
                                value={verifyOtpData.email}
                                onChange={(e) => setVerifyOtpData((p) => ({ ...p, email: e.target.value }))}
                                disabled={redirecting}
                              />
                            </div>
                            <div className="group">
                              <div className="relative">
                                <input
                                  className="w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                  placeholder="OTP Code"
                                  value={verifyOtpData.otp}
                                  onChange={(e) => setVerifyOtpData((p) => ({ ...p, otp: e.target.value }))}
                                  disabled={redirecting}
                                />
                                <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <button
                              className="rounded-xl backdrop-blur-sm bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                              disabled={loading === 'verifyOtp' || !verifyOtpData.email || !verifyOtpData.otp || redirecting}
                              onClick={() => handle('verifyOtp', () => authService.verifyOtp(verifyOtpData))}
                            >
                              {loading === 'verifyOtp' ? (
                                <span className="flex items-center justify-center">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                  Verifying...
                                </span>
                              ) : (
                                'Verify OTP'
                              )}
                            </button>
                            <button
                              className="rounded-xl backdrop-blur-sm bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => {
                                setOtpSent(false);
                                setVerifyOtpData({ email: '', otp: '' });
                              }}
                              disabled={redirecting}
                            >
                              Edit Details
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Terms */}
                    <div className="mt-8 text-center">
                      <p className="text-sm text-gray-500">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-indigo-400 hover:text-indigo-300" style={{ pointerEvents: redirecting ? 'none' : 'auto' }}>Cosmic Terms</a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-400 hover:text-indigo-300" style={{ pointerEvents: redirecting ? 'none' : 'auto' }}>Privacy Policy</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { 
                icon: Sparkles, 
                title: 'AI-Powered Analysis', 
                description: 'Get personalized career insights powered by advanced AI algorithms' 
              },
              { 
                icon: Compass, 
                title: 'Career Navigation', 
                description: 'Navigate your professional journey with celestial precision' 
              },
              { 
                icon: Shield, 
                title: 'Secure & Private', 
                description: 'Your data is protected with enterprise-grade security' 
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2">
                  <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 mb-4">
                    <feature.icon className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Compass className="w-6 h-6 text-indigo-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                NaviRiti
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 NaviRiti. Begin your cosmic career journey today.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;