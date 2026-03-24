"use client";

import { Menu, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";

export default function Header() {
  const router = useRouter();
  const { toggleSidebar } = useUIStore();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const handleSettings = () => {
    router.push(ROUTES.SETTINGS_PROFILE);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        {/* Left: Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Toggle sidebar">
          <Menu size={20} className="text-gray-600" />
        </button>

        {/* Center: Logo (hidden on mobile) */}
        <div className="hidden sm:block flex-1">
          <h1 className="text-base font-semibold text-gray-900">
            Sartaj Foods
          </h1>
        </div>

        {/* Right: Settings button */}
        <div className="flex items-center ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Settings menu">
                <Settings size={20} className="text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleSettings}
                className="flex items-center gap-2 cursor-pointer">
                <User size={16} />
                <span>Profile & Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 cursor-pointer">
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
