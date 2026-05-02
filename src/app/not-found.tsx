"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const homeRoute = isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN;

  useEffect(() => {
    setMounted(true);

    // Countdown Timer Logic
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Safe Redirection Logic (Separated from state update)
  useEffect(() => {
    if (mounted && countdown === 0) {
      router.replace(homeRoute);
    }
  }, [mounted, countdown, router, homeRoute]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
              style={{ width: "auto", height: "auto" }}
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
                Wait!
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            You've landed on the wrong page
          </h2>
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              Redirecting you to safety in{" "}
              <span className="font-bold text-blue-600 text-xl">
                {countdown}
              </span>{" "}
              seconds...
            </p>
            <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>

        {/* Manual Action */}
        <div className="pt-4">
          <Button
            asChild
            variant="ghost"
            className="text-gray-400 hover:text-white transition-colors">
            <Link href={homeRoute}>Skip wait and go now</Link>
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
