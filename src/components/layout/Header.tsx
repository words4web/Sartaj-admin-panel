"use client";

import { Menu } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

export default function Header() {
  const { toggleMobileMenu } = useUIStore();

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="flex items-center h-14 px-4 sm:px-6">
        {/* Left: Mobile menu toggle */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2.5 mr-3 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-200 group"
          aria-label="Open mobile menu">
          <Menu
            size={20}
            className="text-gray-700 group-hover:text-blue-600 transition-colors"
          />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-primary">Sartaj Foods</h1>
        </div>
      </div>
    </header>
  );
}
