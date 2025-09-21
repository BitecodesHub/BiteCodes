"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { PremiumAPI, PremiumStatusResponse } from "@/app/utils/premiumApi";

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
  login: (response: any) => void;
  logout: () => void;
  updatePremiumStatus: (premiumStatus: PremiumStatus) => void;
  isPremiumUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch premium status from backend
  const fetchPremiumStatus = async (userId: number) => {
    try {
      console.log(`🗳 Fetching premium status for userId: ${userId}`);
      const status: PremiumStatusResponse = await PremiumAPI.getPremiumStatus(userId);
      const premiumStatus: PremiumStatus = {
        isPremium: status.hasPremium,
        plan: status.subscriptionType || null,
        expiresAt: status.endDate || null,
        features: status.hasPremium ? ['Unlimited Mock Tests', 'Advanced Analytics', 'Priority Support', 'Exclusive Content', 'Download PDFs', 'No Ads'] : [],
      };
      console.log("✅ Fetched premium status:", premiumStatus);
      return premiumStatus;
    } catch (error: any) {
      console.error("❌ Failed to fetch premium status:", error);
      return {
        isPremium: false,
        plan: null,
        expiresAt: null,
        features: [],
      };
    }
  };

  // Rehydrate from localStorage and sync with backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("🗄 Checking localStorage:", { token, storedUser });

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        const normalizedUser: User = {
          ...parsedUser,
          premiumStatus: parsedUser.premiumStatus || {
            isPremium: false,
            plan: null,
            expiresAt: null,
            features: [],
          },
        };

        console.log("✅ Restored user from localStorage:", normalizedUser);
        setUser(normalizedUser);
        setIsLoggedIn(true);

        // Sync premium status with backend
        fetchPremiumStatus(normalizedUser.userid).then((premiumStatus) => {
          const updatedUser: User = {
            ...normalizedUser,
            premiumStatus,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("✅ Synced premium status from backend:", premiumStatus);
          setLoading(false);
        });
      } catch (err) {
        console.error("❌ Failed to parse stored user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (response: any) => {
    console.log("🔍 Full login response received:", response);
    console.log("💎 premiumStatus in response:", response.premiumStatus);

    const normalizedUser: User = {
      userid: response.userid,
      username: response.username,
      email: response.email,
      name: response.name,
      profileurl: response.profileurl,
      role: response.role,
      premiumStatus: response.premiumStatus || {
        isPremium: false,
        plan: null,
        expiresAt: null,
        features: [],
      },
    };

    // Fetch latest premium status from backend
    const premiumStatus = await fetchPremiumStatus(normalizedUser.userid);
    normalizedUser.premiumStatus = premiumStatus;

    console.log("🔑 Final normalized user:", normalizedUser);
    console.log("💎 Final premiumStatus:", normalizedUser.premiumStatus);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setUser(normalizedUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const updatePremiumStatus = (premiumStatus: PremiumStatus) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      premiumStatus,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    console.log("💎 Updated premium status:", premiumStatus);
  };

  const isPremiumUser = (): boolean => {
    if (!user || !user.premiumStatus) return false;
    const { isPremium, expiresAt } = user.premiumStatus;
    if (!isPremium) return false;
    if (!expiresAt) return true; // No expiry means permanent (e.g., LIFETIME)
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    return now < expiryDate;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, loading, login, logout, updatePremiumStatus, isPremiumUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};