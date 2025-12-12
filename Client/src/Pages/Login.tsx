import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService.ts';

type Status = { type: 'success' | 'error'; message: string } | null;

const LoginPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showReset, setShowReset] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');

  const handle = async (key: string, fn: () => Promise<unknown>) => {
    setStatus(null);
    setLoading(key);
    try {
      await fn();
      setStatus(null);
      // Redirect after successful login - token is already stored by authService
      if (key === 'login') {
        // Small delay to show success message, then redirect
        setTimeout(() => {
          navigate('/ParentForm', { replace: true });
        }, 500);
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
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left - Login */}
        <div className="p-10 flex flex-col justify-center space-y-6">
          <h1 className="text-2xl font-semibold text-[#12a189] text-center">Sign in</h1>
          <div className="flex justify-center gap-3 text-sm text-gray-500">
            <span className="border rounded-full h-9 w-9 grid place-items-center">f</span>
            <span className="border rounded-full h-9 w-9 grid place-items-center">G+</span>
            <span className="border rounded-full h-9 w-9 grid place-items-center">in</span>
          </div>
          <p className="text-center text-xs text-gray-500">or use your email account</p>

          {status?.type === 'error' && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {status.message}
            </div>
          )}

          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
            />
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((p) => ({ ...p, password: e.target.value }))
              }
            />
            <div className="flex flex-col gap-2">
              <button
                className="w-full rounded-full bg-[#12a189] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0f8d78] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading === 'login'}
                onClick={() => handle('login', () => authService.loginUser(loginData))}
              >
                {loading === 'login' ? 'Signing in...' : 'SIGN IN'}
              </button>
              <button
                className="text-xs text-center text-gray-500 hover:text-[#12a189]"
                type="button"
                onClick={() => {
                  setShowReset(true);
                  if (loginData.email) {
                    handle('requestReset', () =>
                      authService.requestPasswordReset({ email: loginData.email }),
                    );
                  }
                }}
                disabled={loading === 'requestReset' || !loginData.email}
              >
                Forgot your password?
              </button>
            </div>
            {showReset && (
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                  placeholder="Reset OTP"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                  placeholder="New Password"
                  type="password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                />
                <button
                  className="w-full rounded-full border border-[#12a189] px-4 py-2 text-sm font-semibold text-[#12a189] shadow transition hover:bg-[#12a189] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={
                    loading === 'resetPassword' ||
                    !loginData.email ||
                    !resetOtp ||
                    !resetNewPassword
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
                  {loading === 'resetPassword' ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right - CTA */}
        <div className="bg-gradient-to-br from-[#10a58e] to-[#0f9bba] text-white p-10 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-semibold">Hello, Friend!</h2>
          <p className="text-sm text-white/80 text-center max-w-xs">
            Enter your personal details and start your journey with us.
          </p>
          <Link
            to="/signup"
            className="mt-2 rounded-full border border-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-[#0f9bba] transition"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

