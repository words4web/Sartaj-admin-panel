"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  BarChart3,
  Package,
  X,
  Settings,
  PanelRight,
  LayoutGrid,
  ListTree,
  Image as ImageIcon,
  Factory,
  Ticket,
  FileText,
  Truck,
  ListOrdered,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/utils/common.utils";
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
    href: ROUTES.CUSTOMERS.LIST,
  },
  {
    icon: LayoutGrid,
    label: "Categories",
    href: ROUTES.CATEGORIES.LIST,
  },
  {
    icon: ListTree,
    label: "Sub Categories",
    href: ROUTES.SUBCATEGORIES.LIST,
  },
  {
    icon: Package,
    label: "Products",
    href: ROUTES.PRODUCTS.LIST,
  },
  {
    icon: ImageIcon,
    label: "Banners",
    href: ROUTES.BANNERS.LIST,
  },
  {
    icon: Factory,
    label: "Manufacturers",
    href: ROUTES.MANUFACTURERS.LIST,
  },
  {
    icon: Ticket,
    label: "Coupons",
    href: ROUTES.COUPONS.LIST,
  },
  {
    icon: ListOrdered,
    label: "Price lists",
    href: ROUTES.PRICE_LISTS.LIST,
  },
  {
    icon: Truck,
    label: "Orders",
    href: ROUTES.ORDERS.LIST,
  },
  {
    icon: Truck,
    label: "Order Config",
    href: ROUTES.ORDER_CONFIG,
  },
  {
    icon: FileText,
    label: "Pages (CMS)",
    href: ROUTES.CMS.LIST,
  },
];

const FOOTER_ITEMS = [
  {
    icon: Settings,
    label: "Settings",
    href: ROUTES.SETTINGS.ROOT,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    closeMobileMenu,
    _hasHydrated,
  } = useUIStore();

  const isActive = (href: string, exact: boolean = false) =>
    exact
      ? pathname === href
      : pathname === href || pathname?.startsWith(href + "/");

  const isCollapsed = sidebarCollapsed && !mobileMenuOpen;

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div
        className={cn(
          "px-4 border-b border-gray-200 lg:border-b-0 flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "h-0 opacity-0" : "h-16 opacity-100 my-2",
        )}>
        <div>
          <div
            className={cn(
              "flex items-center justify-center shrink-0 transition-all duration-300 ease-in-out",
              isCollapsed
                ? "opacity-0 scale-95 pointer-events-none"
                : "opacity-100 scale-100",
            )}>
            <Image
              src="/sartaj_logo.png"
              alt="Sartaj Foods"
              width={160}
              height={50}
              priority
              className="rounded-lg object-contain cursor-pointer"
              style={{ width: "auto", height: "auto" }}
              onClick={() => router.push(ROUTES.DASHBOARD)}
            />
          </div>
        </div>

        {/* Toggle Button for Desktop */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 shrink-0 transition-all duration-300 ease-in-out",
            isCollapsed
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100",
          )}
          title="Collapse Sidebar">
          <PanelRight size={18} />
        </button>

        {/* Close Button for Mobile */}
        <button
          onClick={closeMobileMenu}
          className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
          <X size={20} />
        </button>
      </div>

      {/* Expand/Collapse Handle (Overlays the content slightly when collapsed) */}
      {isCollapsed && (
        <div className="hidden lg:flex justify-center py-2 border-b border-gray-100">
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 bg-white shadow-sm border border-gray-200"
            title="Expand Sidebar">
            <PanelRight size={18} />
          </button>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex flex-col flex-1 justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {MENU_ITEMS?.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, (item as any).exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  active
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  isCollapsed && "justify-center px-0",
                )}
                onClick={() => {
                  if (mobileMenuOpen) {
                    closeMobileMenu();
                  }
                }}>
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    active && "text-blue-500",
                  )}
                />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Items */}
        <div className="px-2 pt-2 border-t border-gray-100">
          {FOOTER_ITEMS?.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, (item as any).exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200",
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50",
                  isCollapsed && "justify-center px-0",
                )}
                onClick={() => {
                  if (mobileMenuOpen) {
                    closeMobileMenu();
                  }
                }}>
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="flex-1">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0",
          sidebarCollapsed ? "w-20" : "w-60",
        )}>
        {sidebarContent}
      </aside>

      {/* Mobile Menu Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={closeMobileMenu}
      />

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-dvh w-64 bg-white border-r border-gray-200 z-50 flex flex-col lg:hidden transition-transform duration-300 ease-in-out transform",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}>
        {_hasHydrated && (
          <div className="flex flex-col h-full flex-1">{sidebarContent}</div>
        )}
      </aside>
    </>
  );
}
