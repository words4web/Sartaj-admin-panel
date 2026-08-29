"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ROUTES } from "@/constants/routes";
import { DashboardStats } from "@/types/dashboard.types";

const STATUS_COLOR_MAP: Record<string, string> = {
  placed: "#0ea5e9",
  processing: "#f59e0b",
  dispatched: "#6366f1",
  delivered: "#10b981",
  cancelled: "#ef4444",
  payment_pending: "#94a3b8",
};

const STATUS_LABEL_MAP: Record<string, string> = {
  placed: "Placed",
  processing: "Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_pending: "Pmt. Pending",
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  unpaid: "bg-rose-100 text-rose-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-blue-100 text-blue-700",
};

interface RecentOrdersCardProps {
  recentOrders?: DashboardStats["recentOrders"];
}

export function RecentOrdersCard({ recentOrders }: RecentOrdersCardProps) {
  const router = useRouter();

  return (
    <Card className="p-6 border-none shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag size={20} className="text-green-500" />
          Recent Orders
        </h2>
        <button
          onClick={() => router.push(ROUTES.ORDERS.LIST)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium hidden sm:table-cell">Date</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium hidden md:table-cell">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentOrders?.map((order) => (
              <tr
                key={order?._id}
                onClick={() => router.push(ROUTES.ORDERS.DETAIL(order?._id))}
                className="hover:bg-gray-50/70 transition cursor-pointer">
                <td className="py-3.5 font-bold text-gray-900 text-sm">
                  #{order?.orderId}
                </td>
                <td className="py-3.5 text-gray-600 font-medium text-sm">
                  {order?.customerName || "—"}
                </td>
                <td className="py-3.5 text-gray-400 text-xs hidden sm:table-cell">
                  {format(new Date(order?.createdAt), "MMM d, yyyy")}
                </td>
                <td className="py-3.5 font-bold text-gray-900 text-sm">
                  ¥{order?.totalAmount?.toLocaleString("ja-JP")}
                </td>
                <td className="py-3.5">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize"
                    style={{
                      backgroundColor: `${STATUS_COLOR_MAP[order?.status]}1a`,
                      color: STATUS_COLOR_MAP[order?.status] ?? "#6b7280",
                    }}>
                    {STATUS_LABEL_MAP[order?.status] ?? order?.status}
                  </span>
                </td>
                <td className="py-3.5 hidden md:table-cell">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize ${
                      PAYMENT_STATUS_COLOR[order?.paymentStatus] ??
                      "bg-gray-100 text-gray-600"
                    }`}>
                    {order?.paymentStatus ?? "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
