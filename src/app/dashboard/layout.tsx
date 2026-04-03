"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { CommonLoader } from "@/components/ui/common-loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && _hasHydrated && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router, mounted, _hasHydrated]);

  if (!mounted || !_hasHydrated || !isAuthenticated) {
    return <CommonLoader />;
  }

  return (
    <div className="flex h-dvh bg-linear-to-br from-gray-50 via-white to-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main 
          key={pathname}
          className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent animate-in fade-in duration-500"
        >
          <div className="min-h-full pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}
