"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  TrendingUp,
  ShoppingBag,
  Clock,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { DashboardStats } from "@/types/dashboard.types";

function KpiCard({
  label,
  value,
  icon: Icon,
  colorClass,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`p-4 border-none shadow-sm transition-all ${
        onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""
      }`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-xl font-extrabold text-gray-900 mt-0.5 tracking-tight truncate">
            {value}
          </p>
        </div>
        <div
          className={`p-2.5 rounded-xl ${colorClass} shadow-sm shrink-0 ml-3`}>
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

export function KpisGrid({
  kpis,
  cancellationRate,
}: {
  kpis?: DashboardStats["kpis"];
  cancellationRate: string;
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <KpiCard
        label="Total Revenue"
        value={`¥${kpis?.totalRevenue?.toLocaleString("ja-JP") ?? 0}`}
        icon={TrendingUp}
        colorClass="bg-blue-100 text-blue-600"
      />
      <KpiCard
        label="Total Orders"
        value={kpis?.totalOrders?.toLocaleString() ?? 0}
        icon={ShoppingBag}
        colorClass="bg-green-100 text-green-600"
        onClick={() => router.push(ROUTES.ORDERS.LIST)}
      />
      <KpiCard
        label="Total Customers"
        value={kpis?.totalCustomers?.toLocaleString() ?? 0}
        icon={Users}
        colorClass="bg-purple-100 text-purple-600"
      />
      <KpiCard
        label="Total Products"
        value={kpis?.totalProducts?.toLocaleString() ?? 0}
        icon={Package}
        colorClass="bg-indigo-100 text-indigo-600"
        onClick={() => router.push(ROUTES.PRODUCTS.LIST)}
      />
      <KpiCard
        label="Pending Orders"
        value={kpis?.pendingOrders?.toLocaleString() ?? 0}
        icon={Clock}
        colorClass="bg-amber-100 text-amber-600"
        onClick={() => router.push(`${ROUTES.ORDERS.LIST}?status=placed`)}
      />
      <KpiCard
        label="Cancellation Rate"
        value={`${cancellationRate}%`}
        icon={XCircle}
        colorClass="bg-rose-100 text-rose-600"
        onClick={() => router.push(`${ROUTES.ORDERS.LIST}?status=cancelled`)}
      />
    </div>
  );
}
