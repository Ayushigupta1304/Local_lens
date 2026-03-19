"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type AuthRole = "user" | "admin";

export type AuthUser = {
  email: string;
  role: AuthRole;
};

type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "authenticated"; user: AuthUser };

type AuthContextValue = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "locallens_mock_auth_v1";

function inferRole(email: string): AuthRole {
  const normalized = email.trim().toLowerCase();
  if (normalized === "admin@locallens.test") return "admin";
  if (normalized.endsWith("@admin.local")) return "admin";
  return "user";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser | null;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const user = readStoredUser();
    return user ? { status: "authenticated", user } : { status: "guest" };
  });

  const persist = useCallback((user: AuthUser | null) => {
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise<void>((r) => window.setTimeout(r, 650));
    if (!isValidEmail(email)) throw new Error("Please enter a valid email.");
    if (password.trim().length < 6) throw new Error("Password must be at least 6 characters.");

    const user: AuthUser = { email: email.trim(), role: inferRole(email) };
    persist(user);
    setState({ status: "authenticated", user });
  }, [persist]);

  const signup = useCallback(async (email: string, password: string) => {
    await new Promise<void>((r) => window.setTimeout(r, 800));
    if (!isValidEmail(email)) throw new Error("Please enter a valid email.");
    if (password.trim().length < 6) throw new Error("Password must be at least 6 characters.");

    const user: AuthUser = { email: email.trim(), role: inferRole(email) };
    persist(user);
    setState({ status: "authenticated", user });
  }, [persist]);

  const logout = useCallback(() => {
    persist(null);
    setState({ status: "guest" });
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({ state, login, signup, logout }),
    [state, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider.");
  return ctx;
}

