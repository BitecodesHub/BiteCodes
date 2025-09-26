"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PremiumAPI, PremiumStatusResponse } from "@/app/utils/premiumApi";
import CryptoJS from "crypto-js";

export interface PremiumStatus {
  isPremium: boolean;
  plan?: string | null;
  expiresAt?: string | null;
  features?: string[];
}

export interface User {
  userid: number;
  username: string;
  email: string;
  name: string;
  profileurl: string;
  role: string;
  premiumStatus: PremiumStatus;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (response: any) => Promise<void>;
  logout: () => void;
  updatePremiumStatus: (premiumStatus: PremiumStatus) => void;
  isPremiumUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔐 AES helpers
const SECRET = process.env.NEXT_PUBLIC_ENCRYPT_KEY || "super-secret-fallback";

const encrypt = (data: object) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();

const decrypt = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Always fetch premium from backend
  const fetchPremiumStatus = async (userId: number): Promise<PremiumStatus> => {
    try {
      const status: PremiumStatusResponse =
        await PremiumAPI.getPremiumStatus(userId);
      return {
        isPremium: status.hasPremium,
        plan: status.subscriptionType || null,
        expiresAt: status.endDate || null,
        features: status.hasPremium
          ? [
              "Unlimited Mock Tests",
              "Advanced Analytics",
              "Priority Support",
              "Exclusive Content",
              "Download PDFs",
              "No Ads",
            ]
          : [],
      };
    } catch {
      return {
        isPremium: false,
        plan: null,
        expiresAt: null,
        features: [],
      };
    }
  };

  // 🔁 Restore user from encrypted localStorage
  const restoreUser = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    const parsed = decrypt(storedUser);
    if (!parsed?.userid) return null;

    // revalidate with backend
    try {
      const freshPremium = await fetchPremiumStatus(parsed.userid);
      return { ...parsed, premiumStatus: freshPremium } as User;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    restoreUser().then((restored) => {
      if (restored) {
        setUser(restored);
        setIsLoggedIn(true);
        localStorage.setItem("user", encrypt(restored));
      } else {
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
  }, []);

  // 🔑 Login flow
  const login = async (response: any) => {
    try {
      const premiumStatus = await fetchPremiumStatus(response.userid);
      const normalizedUser: User = {
        userid: response.userid,
        username: response.username,
        email: response.email,
        name: response.name,
        profileurl: response.profileurl,
        role: response.role,
        premiumStatus,
      };

      localStorage.setItem("user", encrypt(normalizedUser));
      setUser(normalizedUser);
      setIsLoggedIn(true);
    } catch {
      logout();
    }
  };

  // 🚪 Logout clears everything
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  // 💎 Update premium status
  const updatePremiumStatus = (premiumStatus: PremiumStatus) => {
    if (!user) return;
    const updatedUser: User = { ...user, premiumStatus };
    setUser(updatedUser);
    localStorage.setItem("user", encrypt(updatedUser));
  };

  // ⭐ Check premium validity
  const isPremiumUser = (): boolean => {
    if (!user?.premiumStatus) return false;
    const { isPremium, expiresAt } = user.premiumStatus;
    if (!isPremium) return false;
    if (!expiresAt) return true; // lifetime
    return new Date() < new Date(expiresAt);
  };

  // Auto-logout if expired
  useEffect(() => {
    if (!user?.premiumStatus?.expiresAt) return;
    const expiry = new Date(user.premiumStatus.expiresAt).getTime();
    const now = Date.now();
    if (expiry < now) {
      logout();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        updatePremiumStatus,
        isPremiumUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
