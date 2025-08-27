// src/services/authApi.ts
import axios from "axios";
import type { LoginPayload, LoginResponse, SignupPayload, SignupResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const res = await axios.post(`${API_URL}/auth/jwt/create/`, data);
    return res.data;
  },

  signup: async (data: SignupPayload): Promise<SignupResponse> => {
    const res = await axios.post(`${API_URL}/auth/users/`, data);
    return res.data;
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const res = await axios.post(`${API_URL}/auth/jwt/refresh/`, { refresh });
    return res.data;
  },
};
