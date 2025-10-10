"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";

export interface PremiumStatus {
  isPremium: boolean;
  plan?: string | null;
  expiresAt?: string | null;
  features?: string[];
  // Backend compatibility fields
  hasPremium?: boolean;
  subscriptionType?: string | null;
  endDate?: string | null;
}

export interface User {
  userid: number;
  username: string;
  email: string;
  name: string;
  profileurl: string;
  role: string;
  premiumStatus: PremiumStatus;
  phonenum?: string;
  state?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (response: any) => Promise<void>;
  logout: () => void;
  updatePremiumStatus: (premiumStatus: PremiumStatus) => Promise<void>;
  isPremiumUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔐 Encryption helpers
const getSecret = () => {
  if (!process.env.NEXT_PUBLIC_ENCRYPT_KEY) {
    throw new Error("Encryption key not defined in environment");
  }
  return process.env.NEXT_PUBLIC_ENCRYPT_KEY;
};

const encrypt = async (data: object) => {
  const SECRET = getSecret();
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
};

const decrypt = async (ciphertext: string) => {
  try {
    const SECRET = getSecret();
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("❌ Decryption failed:", error);
    return null;
  }
};

// Helper to normalize premium status from backend response
const normalizePremiumStatus = (premiumData: any): PremiumStatus => {
  if (!premiumData) {
    return {
      isPremium: false,
      plan: null,
      expiresAt: null,
      features: []
    };
  }

  // Handle both frontend and backend formats
  const isPremium = premiumData.isPremium || premiumData.hasPremium || false;
  const plan = premiumData.plan || premiumData.subscriptionType || null;
  const expiresAt = premiumData.expiresAt || premiumData.endDate || null;
  
  const features = isPremium ? [
    "Unlimited Mock Tests",
    "Advanced Analytics", 
    "Priority Support",
    "Exclusive Content",
    "Download PDFs",
    "No Ads"
  ] : [];

  return {
    isPremium,
    plan,
    expiresAt,
    features
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore user from localStorage
  const restoreUser = async (): Promise<User | null> => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;

      const parsed = await decrypt(storedUser);
      if (!parsed?.userid) return null;

      console.log("🔄 Restored user from localStorage:", parsed);
      return parsed as User;
    } catch (error) {
      console.error("❌ Failed to restore user:", error);
      localStorage.removeItem("user");
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        console.log("🚀 AuthContext initializing...");
        const restored = await restoreUser();
        
        if (restored) {
          console.log("✅ User restored successfully:", restored.username);
          setUser(restored);
          setIsLoggedIn(true);
        } else {
          console.log("ℹ️ No valid user found in localStorage");
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
        console.log("✅ AuthContext initialization complete");
      }
    })();
  }, []);

  // 🔑 Login function
  const login = async (response: any) => {
    try {
      console.log("🔍 Login function received response:", response);

      // Extract user data - handle both direct response and nested structures
      const userData = response.data || response;
      const userId = userData.userid || userData.id;

      if (!userId) {
        console.error("❌ No user ID found in response:", userData);
        throw new Error("Invalid response structure - missing user ID");
      }

      // Normalize premium status from backend response
      const premiumStatus = normalizePremiumStatus(userData.premiumStatus);

      // Create normalized user object
      const normalizedUser: User = {
        userid: userId,
        username: userData.username || '',
        email: userData.email || '',
        name: userData.name || '',
        profileurl: userData.profileurl || '',
        role: userData.role || 'USER',
        phonenum: userData.phonenum || '',
        state: userData.state || '',
        premiumStatus
      };

      console.log("✅ Normalized user object:", normalizedUser);

      // Encrypt and store user data
      const ciphertext = await encrypt(normalizedUser);
      localStorage.setItem("user", ciphertext);
      
      // Update state
      setUser(normalizedUser);
      setIsLoggedIn(true);

      console.log("🎉 Login successful for user:", normalizedUser.username);

    } catch (error) {
      console.error("❌ Login error:", error);
      logout();
      throw error;
    }
  };

  // 🚪 Logout function
  const logout = () => {
    console.log("🚪 Logging out user...");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    console.log("✅ Logout complete");
  };

  // 💎 Update premium status
  const updatePremiumStatus = async (premiumStatus: PremiumStatus) => {
    if (!user) {
      console.warn("⚠️ Cannot update premium status - no user logged in");
      return;
    }

    try {
      const updatedUser: User = { 
        ...user, 
        premiumStatus: normalizePremiumStatus(premiumStatus) 
      };
      
      setUser(updatedUser);
      
      // Update localStorage
      const ciphertext = await encrypt(updatedUser);
      localStorage.setItem("user", ciphertext);
      
      console.log("✅ Premium status updated:", updatedUser.premiumStatus);
    } catch (error) {
      console.error("❌ Failed to update premium status:", error);
    }
  };

  // ⭐ Check premium validity
  const isPremiumUser = (): boolean => {
    if (!user?.premiumStatus) {
      return false;
    }

    const { isPremium, expiresAt } = user.premiumStatus;
    
    if (!isPremium) {
      return false;
    }

    // If no expiration date, treat as lifetime premium
    if (!expiresAt) {
      return true;
    }

    // Check if premium has expired
    const isExpired = new Date() >= new Date(expiresAt);
    if (isExpired) {
      console.log("⚠️ Premium subscription has expired");
    }
    
    return !isExpired;
  };

  // Auto-logout if premium expired (optional - you might not want this)
  useEffect(() => {
    if (!user?.premiumStatus?.expiresAt) return;
    
    const expiry = new Date(user.premiumStatus.expiresAt).getTime();
    const now = Date.now();
    
    if (expiry < now) {
      console.log("⚠️ Premium expired, but keeping user logged in");
      // Note: Not auto-logging out, just premium features will be disabled
    }
  }, [user]);

  // Debug logging for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 AuthContext State:", {
        isLoggedIn,
        hasUser: !!user,
        username: user?.username,
        isPremium: isPremiumUser(),
        loading
      });
    }
  }, [user, isLoggedIn, loading]);

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
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};