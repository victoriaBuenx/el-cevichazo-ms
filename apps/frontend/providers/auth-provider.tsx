"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { logoutAction } from "@/actions/auth.actions";

export interface UserSession {
  userId?: string;
  id?: string;
  userName?: string;
  nombre?: string;
  email?: string;
  role?: string;
  rol?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: UserSession | null;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: UserSession | null;
}) {
  const [user, setUser] = useState<UserSession | null>(initialUser);
  const [isPending, startTransition] = useTransition();

  const logout = async () => {
    startTransition(async () => {
      try {
        await logoutAction();
        setUser(null);
      } catch (error) {
        console.error("Error during logout:", error);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isLoggingOut: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
