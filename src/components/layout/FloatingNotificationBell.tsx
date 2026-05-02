"use client";

import { Bell } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useNotificationStore } from "@/stores/notificationStore";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/common.utils";

interface NotificationBellProps {
  isCollapsed?: boolean;
}

export default function FloatingNotificationBell({
  isCollapsed = false,
}: NotificationBellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const active = pathname === ROUTES.NOTIFICATIONS;

  return (
    <button
      onClick={() => router.push(ROUTES.NOTIFICATIONS)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
        active
          ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
          : unreadCount > 0
            ? "bg-blue-50/80 text-blue-700 border border-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:bg-blue-100/60"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        isCollapsed && "justify-center px-0",
      )}
      aria-label="View notifications">
      {/* Shimmer overlay — separate from button background so they don't conflict */}
      {!active && unreadCount > 0 && (
        <span className="pointer-events-none absolute inset-0 animate-shimmer rounded-lg" />
      )}

      <div className="relative">
        <Bell
          size={22}
          className={cn(
            "shrink-0 transition-transform group-hover:scale-110",
            active ? "text-blue-500" : "text-gray-600",
            unreadCount > 0 && "animate-ring text-blue-600",
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
          </span>
        )}
      </div>

      {!isCollapsed && (
        <>
          <span className="flex-1 truncate text-left font-semibold">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full min-w-[24px] text-center shadow-sm animate-in zoom-in duration-300">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </>
      )}
    </button>
  );
}
