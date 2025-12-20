import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService.ts';

type Status = { type: 'success' | 'error'; message: string } | null;

const SignupPage = () => {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const [registerNoOtpData, setRegisterNoOtpData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [registerOtpData, setRegisterOtpData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [verifyOtpData, setVerifyOtpData] = useState({
    email: '',
    otp: '',
  });

  const handle = async (key: string, fn: () => Promise<unknown>) => {
    setStatus(null);
    setLoading(key);
    try {
      await fn();
      setStatus(null);
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
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left - CTA */}
        <div className="bg-gradient-to-br from-[#10a58e] to-[#0f9bba] text-white p-10 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-semibold">Welcome Back!</h2>
          <p className="text-sm text-white/80 text-center max-w-xs">
            To keep connected with us please login with your personal info.
          </p>
          <Link
            to="/login"
            className="mt-2 rounded-full border border-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-[#0f9bba] transition"
          >
            SIGN IN
          </Link>
        </div>

        {/* Right - Signup */}
        <div className="p-10 flex flex-col justify-center space-y-6">
          <h1 className="text-2xl font-semibold text-[#12a189] text-center">Create Account</h1>
          <div className="flex justify-center gap-3 text-sm text-gray-500">
            <span className="border rounded-full h-9 w-9 grid place-items-center">f</span>
            <span className="border rounded-full h-9 w-9 grid place-items-center">G+</span>
            <span className="border rounded-full h-9 w-9 grid place-items-center">in</span>
          </div>
          <p className="text-center text-xs text-gray-500">or use your email for registration</p>

          {status?.type === 'error' && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {status.message}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                placeholder="Name"
                value={registerNoOtpData.name}
                onChange={(e) =>
                  setRegisterNoOtpData((p) => ({ ...p, name: e.target.value }))
                }
              />
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                placeholder="Email"
                value={registerNoOtpData.email}
                onChange={(e) =>
                  setRegisterNoOtpData((p) => ({ ...p, email: e.target.value }))
                }
              />
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                placeholder="Password"
                type="password"
                value={registerNoOtpData.password}
                onChange={(e) =>
                  setRegisterNoOtpData((p) => ({ ...p, password: e.target.value }))
                }
              />
              <button
                className="w-full rounded-full bg-[#12a189] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0f8d78] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={
                  loading === 'registerNoOtp' ||
                  !registerNoOtpData.email ||
                  !registerNoOtpData.password
                }
                onClick={() =>
                  handle('registerNoOtp', () =>
                    authService.registerNoOtp(registerNoOtpData),
                  )
                }
              >
                {loading === 'registerNoOtp' ? 'Submitting...' : 'SIGN UP'}
              </button>
            </div>

            <div className="space-y-2">
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                placeholder="Name (OTP flow)"
                value={registerOtpData.name}
                onChange={(e) => setRegisterOtpData((p) => ({ ...p, name: e.target.value }))}
              />
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                placeholder="Email (OTP flow)"
                value={registerOtpData.email}
                onChange={(e) =>
                  setRegisterOtpData((p) => ({ ...p, email: e.target.value }))
                }
              />
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                placeholder="Password (OTP flow)"
                type="password"
                value={registerOtpData.password}
                onChange={(e) =>
                  setRegisterOtpData((p) => ({ ...p, password: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <button
                  className="w-1/2 rounded-full bg-[#12a189] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0f8d78] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={
                    loading === 'registerOtp' ||
                    !registerOtpData.email ||
                    !registerOtpData.password
                  }
                  onClick={() =>
                    handle('registerOtp', () => authService.registerOtp(registerOtpData))
                  }
                >
                  {loading === 'registerOtp' ? 'Sending...' : 'Send OTP'}
                </button>
                <button
                  className="w-1/2 rounded-full border border-[#12a189] px-4 py-2 text-sm font-semibold text-[#12a189] shadow transition hover:bg-[#12a189] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading === 'verifyOtp' || !verifyOtpData.email || !verifyOtpData.otp}
                  onClick={() => handle('verifyOtp', () => authService.verifyOtp(verifyOtpData))}
                >
                  {loading === 'verifyOtp' ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                  placeholder="Verify Email"
                  value={verifyOtpData.email}
                  onChange={(e) => setVerifyOtpData((p) => ({ ...p, email: e.target.value }))}
                />
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#12a189] focus:outline-none"
                  placeholder="OTP Code"
                  value={verifyOtpData.otp}
                  onChange={(e) => setVerifyOtpData((p) => ({ ...p, otp: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

