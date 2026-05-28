"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

/**
 * Convenience hook to access auth state and actions.
 * Must be used inside an <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
