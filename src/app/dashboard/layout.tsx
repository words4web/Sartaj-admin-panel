"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-dvh bg-linear-to-br from-gray-50 via-white to-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="min-h-full pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}
