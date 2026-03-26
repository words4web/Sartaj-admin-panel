"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const publicPaths: string[] = [ROUTES.LOGIN];
    const isPublicPage = publicPaths.includes(pathname);

    if (!isAuthenticated && !isPublicPage) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, pathname, router, mounted]);

  if (!mounted) {
    return null;
  }

  const publicPaths: string[] = [ROUTES.LOGIN];
  const isPublicPage = publicPaths.includes(pathname);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
