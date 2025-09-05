"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Course {
  slug: string;
  name: string;
  price: number;
}

export interface User {
  userid: number;
  username: string;
  email: string;
  name: string;
  profileurl: string;
  role: string;
  purchasedCourses: Course[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (response: any) => void; // Now expects full backend response
  logout: () => void;
  addPurchasedCourse: (course: Course) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Rehydrate from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    console.log("🗄 Checking localStorage:", { token, storedUser });
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        const normalizedUser: User = {
          ...parsedUser,
          purchasedCourses: Array.isArray(parsedUser.purchasedCourses)
            ? parsedUser.purchasedCourses
            : [],
        };
        
        console.log("✅ Restored user from localStorage:", normalizedUser);
        setUser(normalizedUser);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("❌ Failed to parse stored user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setLoading(false);
  }, []);

  // 🔑 Login and save user + token
  const login = (response: any) => {
    // 🐛 Debug: Log the entire response to see what we're getting
    console.log("🔍 Full login response received:", response);
    console.log("📚 purchasedCourses in response:", response.purchasedCourses);
    console.log("📚 purchasedCourses type:", typeof response.purchasedCourses);
    console.log("📚 purchasedCourses is array:", Array.isArray(response.purchasedCourses));
    
    const normalizedUser: User = {
      userid: response.userid,
      username: response.username,
      email: response.email,
      name: response.name,
      profileurl: response.profileurl,
      role: response.role,
      // ✅ FIX: Properly extract purchasedCourses from response
      purchasedCourses: Array.isArray(response.purchasedCourses)
        ? response.purchasedCourses
        : [],
    };
    
    console.log("🔑 Final normalized user:", normalizedUser);
    console.log("🔑 Final purchasedCourses:", normalizedUser.purchasedCourses);
    
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    
    setUser(normalizedUser);
    setIsLoggedIn(true);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  // ➕ Add a new purchased course
  const addPurchasedCourse = (course: Course) => {
    if (!user) return;
    
    const alreadyPurchased = user.purchasedCourses.some(c => c.slug === course.slug);
    if (alreadyPurchased) return;
    
    const updatedUser: User = {
      ...user,
      purchasedCourses: [...user.purchasedCourses, course],
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, loading, login, logout, addPurchasedCourse }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};