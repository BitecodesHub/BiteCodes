"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

const protectedPaths: string[] = [
  "/profile",
  "/mock-tests",
  "/mock-attempts" // protects all exams pages
];

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));
    if (needsAuth && !isLoggedIn) {
      router.push("/login");
    }
  }, [pathname, isLoggedIn, router]);

  return <>{children}</>;
}
