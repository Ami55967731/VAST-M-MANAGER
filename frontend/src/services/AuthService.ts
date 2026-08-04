import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = async (
  payload: RegisterPayload
) => {
  const response = await api.post(
    ENDPOINTS.auth.register,
    payload
  );

  return response.data;
};

export const login = async (
  payload: LoginPayload
) => {
  const response = await api.post(
    ENDPOINTS.auth.login,
    payload
  );

  console.log(response.data);

  const { accessToken, refreshToken } =
    response.data.data.accessToken;

  localStorage.setItem("token", accessToken);
  localStorage.setItem(
    "refreshToken",
    refreshToken
  );

  return response.data;
};

export interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload
) => {
  const response = await api.post(
    ENDPOINTS.auth.forgotPassword,
    payload
  );

  return response.data;
};

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const verifyOtp = async (
  payload: VerifyOtpPayload
) => {
  const response = await api.post(
    ENDPOINTS.auth.verifyOtp,
    payload
  );

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};