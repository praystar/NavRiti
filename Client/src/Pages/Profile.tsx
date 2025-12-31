/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { 
  User, Mail, Shield, Calendar, Clock, 
  Star, Sparkles, Globe, Award, Target,
  CheckCircle, AlertCircle, Download, RefreshCw,
  Zap, BarChart3, TrendingUp, Activity, Info
} from 'lucide-react';
import authService from '../services/authService.ts';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background.tsx';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);
      
      // Fetch user profile from authService
      const response = await authService.getProfile();
      
      // The response should have { status: 'success', user: {...} }
      if (response && typeof response === 'object' && 'user' in response) {
        const userData = (response as { user: UserProfile }).user;
        setProfile(userData);
      } else {
        // If the structure is different, try to use the response directly
        setProfile(response as UserProfile);
      }
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleExportData = () => {
    if (!profile) return;
    
    const exportData = {
      Profile: profile,
      ExportDate: new Date().toISOString(),
      Platform: 'NaviRiti Cosmic Career Platform'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naviriti-profile-${profile.id.slice(-8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate account age in days
  const getAccountAge = () => {
    if (!profile?.createdAt) return 0;
    const created = new Date(profile.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-8">
      {/* Profile Header Skeleton */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-700/40"></div>
          <div className="space-y-3 flex-1">
            <div className="h-8 bg-gray-700/40 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-700/40 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Metrics Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-700/40 rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900/40 rounded-2xl p-4 h-32"></div>
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-6 bg-gray-700/40 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900/40 rounded-xl p-4 h-20"></div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-700/40 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900/40 rounded-xl p-4 h-20"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <AppNavbar showAuthLinks={false} />
      <Background intensity="medium" showConstellations={true} />
      
      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6">
            <User className="w-4 h-4 text-indigo-300 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Cosmic Profile
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Your Celestial
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-300">Identity & Journey</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore your cosmic profile and journey metrics across the stars
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="relative backdrop-blur-xl bg-gray-900/40 border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10">
            {/* Profile Header - Changed background color */}
            <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 px-8 py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-lg"></div>
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30 flex items-center justify-center">
                      <User className="w-10 h-10 text-indigo-300" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {profile?.name || 'Cosmic Navigator'}
                    </h2>
                    <p className="text-gray-300 text-sm mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile?.email || 'Loading...'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        profile?.isVerified 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {profile?.isVerified ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified Account
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Unverified Account
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {loading ? (
                <SkeletonLoader />
              ) : error ? (
                <div className="relative backdrop-blur-sm bg-rose-500/10 border border-rose-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-rose-300">Cosmic Connection Error</p>
                      <p className="text-sm text-rose-200/80 mt-1">{error}</p>
                      <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 rounded-xl backdrop-blur-sm bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-500/30 transition-all duration-300 text-sm"
                      >
                        Retry Connection
                      </button>
                    </div>
                  </div>
                </div>
              ) : profile ? (
                <div className="space-y-8">
                  {/* Account Metrics */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-400" />
                      Account Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="relative group">
                        <div className="relative backdrop-blur-sm bg-gray-900/40 border border-indigo-500/20 rounded-2xl p-4 transition-all duration-300 hover:border-indigo-500/40">
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                              <Calendar className="w-4 h-4 text-indigo-300" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                              {getAccountAge()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">Days in Cosmos</div>
                        </div>
                      </div>

                      <div className="relative group">
                        <div className="relative backdrop-blur-sm bg-gray-900/40 border border-emerald-500/20 rounded-2xl p-4 transition-all duration-300 hover:border-emerald-500/40">
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                              <Target className="w-4 h-4 text-emerald-300" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                              {profile.isVerified ? '100%' : '50%'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">Account Status</div>
                        </div>
                      </div>

                      <div className="relative group">
                        <div className="relative backdrop-blur-sm bg-gray-900/40 border border-amber-500/20 rounded-2xl p-4 transition-all duration-300 hover:border-amber-500/40">
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                              <Activity className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                              Active
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">Current Status</div>
                        </div>
                      </div>

                      <div className="relative group">
                        <div className="relative backdrop-blur-sm bg-gray-900/40 border border-purple-500/20 rounded-2xl p-4 transition-all duration-300 hover:border-purple-500/40">
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                              <Star className="w-4 h-4 text-purple-300" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                              Member
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">Account Tier</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        Account Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-gray-900/40 border border-emerald-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                              <User className="w-4 h-4 text-emerald-300" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Full Name</div>
                              <div className="text-sm font-semibold text-white">
                                {profile.name || 'Not Provided'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-gray-900/40 border border-emerald-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                              <Mail className="w-4 h-4 text-emerald-300" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Email Address</div>
                              <div className="text-sm font-semibold text-white">
                                {profile.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-gray-900/40 border border-emerald-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                              <Shield className="w-4 h-4 text-emerald-300" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Account ID</div>
                              <div className="text-sm font-semibold text-white font-mono">
                                {profile.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        Activity Timeline
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-gray-900/40 border border-amber-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                              <Calendar className="w-4 h-4 text-amber-300" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Joined Cosmos</div>
                              <div className="text-sm font-semibold text-white">
                                {profile.createdAt ? formatDate(profile.createdAt) : 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-gray-900/40 border border-amber-500/20">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                              <Clock className="w-4 h-4 text-amber-300" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Last Updated</div>
                              <div className="text-sm font-semibold text-white">
                                {profile.updatedAt ? formatDate(profile.updatedAt) : 'Never'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl backdrop-blur-sm bg-gray-900/40 border border-amber-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-400">Cosmic Journey Progress</div>
                            <div className="text-sm font-semibold text-white">
                              {getAccountAge()} days
                            </div>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min((getAccountAge() / 365) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {Math.min(getAccountAge(), 365)} of 365 days (First Year Journey)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Note about additional data */}
             
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-white/10 mb-4">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-400">No profile data found</p>
                  <p className="text-sm text-gray-500 mt-2">Please complete your profile setup</p>
                </div>
              )}
            </div>

            {/* Footer with action buttons */}
            <div className="border-t border-indigo-500/20 p-6 bg-gradient-to-r from-gray-900/50 to-gray-900/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-400">
                  <span className="text-gray-300">Profile ID:</span>{' '}
                  <span className="font-mono text-indigo-300">
                    {profile?.id ? profile.id.slice(0, 12) + '...' : 'Loading...'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleExportData}
                    disabled={!profile || refreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400/50 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {refreshing ? 'Refreshing...' : 'Export Data'}
                  </button>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white hover:border-emerald-400/50 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;