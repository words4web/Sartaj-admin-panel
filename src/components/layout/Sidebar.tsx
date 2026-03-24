"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Users, BarChart3, Package, Menu, X, Settings } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

const MENU_ITEMS = [
  {
    icon: BarChart3,
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    exact: true,
  },
  {
    icon: Users,
    label: "Customers",
    href: ROUTES.CUSTOMERS,
  },
  {
    icon: Package,
    label: "Products",
    href: ROUTES.PRODUCTS,
  },
];

const FOOTER_ITEMS = [
  {
    icon: Settings,
    label: "Settings",
    href: ROUTES.SETTINGS,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen } = useUIStore();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActive = (href: string, exact: boolean = false) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 lg:border-b-0 my-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <Image
              src="/sartaj_logo.svg"
              alt="Sartaj Foods"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-gray-900 whitespace-nowrap">
              Sartaj Foods
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1 hover:bg-gray-100 rounded">
          <X size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col h-full justify-between">
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, (item as any).exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => {
                  if (mobileMenuOpen) {
                    toggleSidebar();
                  }
                }}>
                <Icon size={20} className="shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
        {/* Footer Items */}
        <footer className="">
          {FOOTER_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, (item as any).exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 transition-colors duration-200",
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => {
                  if (mobileMenuOpen) {
                    toggleSidebar();
                  }
                }}>
                <Icon size={20} className="shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </footer>
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-48",
        )}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex flex-col lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
