"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Custom 404 Not Found Page
 * Matches the premium aesthetic of the Sartaj Foods Admin Panel.
 */
export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smart Redirection: If authenticated and hits a top-level 404 (typo),
  // redirect into the dashboard context so the Sidebar/Header are visible.
  useEffect(() => {
    if (
      mounted &&
      _hasHydrated &&
      isAuthenticated &&
      !pathname.startsWith("/dashboard/")
    ) {
      router.replace("/dashboard/404");
    }
  }, [mounted, _hasHydrated, isAuthenticated, pathname, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const homeRoute = isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <Link href={homeRoute}>
            <Image
              src="/sartaj_logo.png"
              alt="Sartaj Foods"
              width={160}
              height={64}
              priority
              className="h-16 w-auto object-contain hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        {/* 404 Content */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <h1 className="text-9xl font-black text-blue-900/10 select-none tracking-tighter">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-extrabold text-gray-900">
                Oops!
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
          <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            variant="outline"
            className="h-11 px-6 group font-medium"
            onClick={() => window.history.back()}>
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>

          <Button
            asChild
            className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200/50 font-medium">
            <Link href={homeRoute}>
              <Home className="mr-2 h-4 w-4" />
              {isAuthenticated ? "Dashboard" : "Login Page"}
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-12">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Sartaj Foods Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
