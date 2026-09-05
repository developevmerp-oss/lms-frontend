"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/config/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  points?: number;
  xpPoints?: number;
  streak?: number;
  membershipLevel?: string;
  rank?: string;
  level?: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  city?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const refreshUser = async () => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        const freshUser = data?.user || data;
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  useEffect(() => {
    // Check local storage on initial load
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed?.user || parsed);
      } catch (e) {
        console.error(e);
      }
      // Silently fetch fresh user profile from DB to sync avatar and details
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            const freshUser = data.user || data;
            setUser(freshUser);
            localStorage.setItem("user", JSON.stringify(freshUser));
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    
    if (newUser.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/student/feed");
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem("user", JSON.stringify(merged));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, refreshUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
