"use client";

import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardNotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Safe Redirection Logic
  useEffect(() => {
    if (countdown === 0) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-blue-50/50 p-8 rounded-full mb-6 border border-blue-100/50 relative">
        <SearchX className="h-16 w-16 text-blue-600/30" />
        <div className="absolute inset-0 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
        Wait! You've landed on the wrong page
      </h1>
      <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed text-lg">
        Redirecting you to the dashboard home in{" "}
        <span className="font-bold text-blue-600 text-xl">{countdown}</span>{" "}
        seconds...
      </p>

      <div className="flex flex-col items-center gap-4">
        <Button
          asChild
          variant="ghost"
          className="text-gray-400 hover:text-white transition-colors">
          <Link href={ROUTES.DASHBOARD}>Skip wait and go now</Link>
        </Button>
      </div>

      <div className="mt-12 opacity-0 animate-in fade-in duration-1000 delay-500">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Sartaj Foods Admin System
        </p>
      </div>
    </div>
  );
}
