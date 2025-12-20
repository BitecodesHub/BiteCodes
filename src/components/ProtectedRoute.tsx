"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../app/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const authProtectedPaths: string[] = [
  "/donations",
  "/donate",
  "/profile",
  "/mock-attempts",
   "/mock-tests",
  "/previous-year-papers",
  "/study-material",
];

const premiumProtectedPaths: string[] = [
 
];

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isPremiumUser, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth and premium status to load

    const needsAuth = authProtectedPaths.some((path) => pathname.startsWith(path));
    const needsPremium = premiumProtectedPaths.some((path) => pathname.startsWith(path));

    if (needsAuth && !isLoggedIn) {
      console.log(`🔒 Redirecting to /login from ${pathname} (not authenticated)`);
      router.push("/login");
    } else if (needsPremium && !isLoggedIn) {
      console.log(`🔒 Redirecting to /login from ${pathname} (not authenticated, premium route)`);
      router.push("/login");
    } 
    // else if (needsPremium && !isPremiumUser()) {
    //   console.log(`💎 Redirecting to /premium from ${pathname} (not premium)`);
    //   router.push("/premium");
    // }
  }, [pathname, isLoggedIn, isPremiumUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}