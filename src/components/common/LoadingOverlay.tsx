"use client";

import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";

export function LoadingOverlay() {
  const isLoading = useAuthStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-10 animate-pulse">
          <Image
            src="/sartaj_logo.png"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex gap-1.5 pt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" />
        </div>
        <p className="text-sm font-medium text-blue-900/60 animate-pulse">
          Please wait...
        </p>
      </div>
    </div>
  );
}
