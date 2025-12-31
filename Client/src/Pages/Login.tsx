import { useState, useEffect  } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService.ts';
import {
  Compass,
  Sparkles,
  Star,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  ChevronRight,
  Shield,
  Key,
  LogIn,
  UserPlus,
} from 'lucide-react';
import Background from '../components/Background';

type Status = { type: 'success' | 'error'; message: string } | null;

const LoginPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState<string | null>(null);
  // ADD THIS STATE FOR REDIRECT MESSAGE
  const [redirecting, setRedirecting] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showReset, setShowReset] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      setStatus({ type: 'success', message: 'Success! Redirecting...' });
      // Redirect after successful login - token is already stored by authService
      if (key === 'login') {
        // Small delay to show success message, then redirect
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else if (key === 'resetPassword') {
        setShowReset(false);
        setResetOtp('');
        setResetNewPassword('');
      }
    } catch (err: unknown) {
      const responseMessage =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined;

      const msg =
        responseMessage ??
        (err instanceof Error ? err.message : 'Request failed');
      setStatus({ type: 'error', message: msg });
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
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10"
              >
                Home
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
                Cosmic Gateway
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Welcome Back,
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Cosmic Navigator
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Continue your celestial journey towards career enlightenment
            </p>
          </div>

          {/* Main Content */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 rounded-3xl blur-2xl"></div>
            
            <div className="relative backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <div className="grid md:grid-cols-2">
                {/* Left - Login Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      <LogIn className="inline w-7 h-7 mr-3 text-indigo-400" />
                      Sign In
                    </h2>
                    <p className="text-gray-400">Enter your cosmic credentials to continue</p>
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
                            <Sparkles className="w-5 h-5 mr-2" />
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

                  <div className="space-y-6">
                    {/* Email Input */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <input
                          className="relative w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="your.email@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
                          disabled={redirecting}
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Lock className="inline w-4 h-4 mr-2" />
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="relative w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
                          disabled={redirecting}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={redirecting}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Login Button */}
                    <button
                      className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={loading === 'login' || !loginData.email || !loginData.password || redirecting}
                      onClick={() => handle('login', () => authService.loginUser(loginData))}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/20 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <span className="relative flex items-center justify-center">
                        {loading === 'login' ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Signing In...
                          </>
                        ) : (
                          <>
                            Begin Cosmic Journey
                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>

                    {/* Forgot Password */}
                    <div className="text-center">
                      <button
                        className="text-sm text-gray-400 hover:text-indigo-300 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                        onClick={() => {
                          setShowReset(true);
                          if (loginData.email) {
                            handle('requestReset', () =>
                              authService.requestPasswordReset({ email: loginData.email }),
                            );
                          }
                        }}
                        disabled={loading === 'requestReset' || !loginData.email || redirecting}
                      >
                        <Key className="inline w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Forgot your cosmic password?
                      </button>
                    </div>

                    {/* Reset Password Form */}
                    {showReset && (
                      <div className="space-y-4 border-t border-white/10 pt-6 mt-6">
                        <div className="flex items-center mb-4">
                          <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                          <h3 className="text-lg font-semibold text-white">Reset Your Cosmic Access</h3>
                        </div>
                        
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Shield className="inline w-4 h-4 mr-2" />
                            Reset OTP
                          </label>
                          <input
                            className="w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Enter OTP sent to your email"
                            value={resetOtp}
                            onChange={(e) => setResetOtp(e.target.value)}
                            disabled={redirecting}
                          />
                        </div>
                        
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Lock className="inline w-4 h-4 mr-2" />
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              className="w-full rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="Enter new password"
                              value={resetNewPassword}
                              onChange={(e) => setResetNewPassword(e.target.value)}
                              disabled={redirecting}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              disabled={redirecting}
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <button
                          className="w-full rounded-xl backdrop-blur-sm bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={
                            loading === 'resetPassword' ||
                            !loginData.email ||
                            !resetOtp ||
                            !resetNewPassword ||
                            redirecting
                          }
                          onClick={() =>
                            handle('resetPassword', () =>
                              authService.resetPassword({
                                email: loginData.email,
                                otp: resetOtp,
                                newPassword: resetNewPassword,
                              }),
                            )
                          }
                        >
                          {loading === 'resetPassword' ? (
                            <span className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                              Resetting Access...
                            </span>
                          ) : (
                            'Reset Cosmic Password'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right - CTA */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-emerald-900/30 border-l border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-white/10 mb-4">
                      <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white">
                      New to the <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Cosmos</span>?
                    </h2>
                    
                    <p className="text-gray-300 max-w-md">
                      Begin your celestial journey of career discovery. Join NaviRiti to unlock personalized career guidance powered by AI and ancient wisdom.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>AI-Powered Career Analysis</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Personalized Cosmic Guidance</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Interactive Career Galaxy</span>
                      </div>
                    </div>
                    
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center px-8 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ pointerEvents: redirecting ? 'none' : 'auto' }}
                    >
                      <User className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Create Cosmic Account
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-10 left-10 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              By continuing, you agree to our{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">Cosmic Terms</a>{' '}
              and{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
            </p>
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
              © 2024 NaviRiti. Where ancient wisdom meets artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;