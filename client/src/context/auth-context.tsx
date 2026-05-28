"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { apiClient, ApiError } from "@/lib/api";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount by calling GET /api/auth/get-me
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const data = await apiClient<{
          message: string;
          id: string;
          username: string;
          email: string;
        }>("/api/auth/get-me");

        if (!cancelled) {
          setUser({
            id: data.id,
            username: data.username,
            email: data.email,
          });
        }
      } catch {
        // Not logged in — that's fine
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiClient<{
      message: string;
      user: AuthUser;
    }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    setUser(data.user);
  }, []);

  const signup = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await apiClient<{
        message: string;
        user: AuthUser;
      }>("/api/auth/register", {
        method: "POST",
        body: { username, email, password },
      });

      setUser(data.user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiClient("/api/auth/logout");
    } catch {
      // Even if the API call fails, clear local state
    }
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const data = await apiClient<{ message: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: { email },
      }
    );
    return data.message;
  }, []);

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      await apiClient("/api/auth/reset-password", {
        method: "POST",
        body: { token, password },
      });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
