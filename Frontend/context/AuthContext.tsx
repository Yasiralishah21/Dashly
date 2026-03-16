"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

// Demo-only: hardcoded credentials for frontend testing (no real backend).
const DEMO_USERNAME = "YasirAli";
const DEMO_PASSWORD = "123456";

export interface AuthUser {
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback((username: string, password: string) => {
    const name = username.trim();
    const pass = password.trim();
    if (name === DEMO_USERNAME && pass === DEMO_PASSWORD) {
      setUser({ name });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextValue = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
