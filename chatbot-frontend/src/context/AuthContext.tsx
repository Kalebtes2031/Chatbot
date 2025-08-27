// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setAccessToken(token);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`, { username, password });
    setAccessToken(response.data.access);
    localStorage.setItem("accessToken", response.data.access);

    // Fetch user profile
    const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users/me/`, {
      headers: { Authorization: `Bearer ${response.data.access}` },
    });
    setUser(userRes.data);
    localStorage.setItem("user", JSON.stringify(userRes.data));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
