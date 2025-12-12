import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import authService from '../services/authService.ts';
import AppNavbar from '../components/AppNavbar';

const ProfilePage = () => {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await authService.getProfile();
        const user = (data as { user?: Record<string, unknown> }).user || {};
        setProfile(user);
      } catch (err: unknown) {
        const responseMessage =
          err &&
          typeof err === 'object' &&
          'response' in err &&
          typeof (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message === 'string'
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;

        const msg =
          responseMessage ??
          (err instanceof Error ? err.message : 'Failed to load profile');
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AppNavbar showAuthLinks={false} />
      <div className="pt-20 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D9488] to-[#0b7d73] px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Profile</h1>
                  <p className="text-white/80 text-sm mt-1">Your account information</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm font-medium">Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {!loading && !error && profile && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 grid gap-3">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Profile
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {(profile.name as string) || '—'}
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {(profile.email as string) || '—'}
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Verified</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {(profile.isVerified as boolean) ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {profile.createdAt
                            ? new Date(profile.createdAt as string).toLocaleString()
                            : '—'}
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Updated</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {profile.updatedAt
                            ? new Date(profile.updatedAt as string).toLocaleString()
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && !profile && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No profile data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

