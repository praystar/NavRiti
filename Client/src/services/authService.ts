/* eslint-disable no-useless-catch */
import api from './api.ts';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: unknown;
}

export interface ProfileResponse {
  user: unknown;
}

export interface RegisterOtpPayload {
  email: string;
  password: string;
  name?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface RegisterNoOtpPayload {
  email: string;
  password: string;
  name?: string;
}

const TOKEN_STORAGE_KEY = 'authToken';

const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const loginUser = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    setStoredToken(response.data?.token ?? null);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const testToken = async (): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/test-token');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await api.get<ProfileResponse>('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerOtp = async (
  payload: RegisterOtpPayload,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register-otp', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/verify-otp', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (
  payload: RequestPasswordResetPayload,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      '/auth/request-password-reset',
      payload,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/reset-password', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    throw error;
  } finally {
    setStoredToken(null);
  }
};

export const registerNoOtp = async (
  payload: RegisterNoOtpPayload,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register-no-otp', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(TOKEN_STORAGE_KEY);
};

const authService = {
  loginUser,
  testToken,
  getProfile,
  registerOtp,
  registerNoOtp,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  logoutUser,
  isAuthenticated
};

export default authService;

