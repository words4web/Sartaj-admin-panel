"use client";

import { useMemo } from "react";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
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

export function OrderStatusChart({
  statusBreakdown,
}: {
  statusBreakdown?: DashboardStats["statusBreakdown"];
}) {
  const statusData = useMemo(
    () =>
      statusBreakdown?.map((item) => ({
        name: STATUS_LABEL_MAP[item._id] ?? item?._id,
        value: item.count,
        fill: STATUS_COLOR_MAP[item._id] ?? "#94a3b8",
      })) || [],
    [statusBreakdown],
  );

  return (
    <Card className="p-6 border-none shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package size={20} className="text-blue-500" />
        Order Status Breakdown
      </h2>
      {!statusData.length ? (
        <div className="h-[260px] flex items-center justify-center text-gray-400 text-sm">
          No data for this period.
        </div>
      ) : (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} barSize={36}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#f9fafb" }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.12)",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
