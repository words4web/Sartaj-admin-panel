"use client";

import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DashboardStats } from "@/types/dashboard.types";

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload?.map((p: any) => (
        <p
          key={p?.dataKey}
          style={{ color: p?.color }}
          className="font-semibold">
          {p?.dataKey === "revenue"
            ? `Revenue: ¥${p?.value?.toLocaleString()}`
            : `Orders: ${p?.value}`}
        </p>
      ))}
    </div>
  );
}

export function RevenueTrendChart({
  data,
  activePresetLabel,
}: {
  data?: DashboardStats["revenueByDay"];
  activePresetLabel?: string;
}) {
  return (
    <Card className="p-6 border-none shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-500" />
        Revenue Trend
      </h2>
      <p className="text-xs text-gray-400 mb-6">
        {activePresetLabel || "All time"} — daily revenue (¥) and order count
      </p>
      {!data?.length ? (
        <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
          No data for this period.
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickFormatter={(v) => {
                  try {
                    return format(new Date(v), "MMM d");
                  } catch {
                    return v;
                  }
                }}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickFormatter={(v) => `¥${(v / 1000)?.toFixed(0)}k`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(val) =>
                  val === "revenue" ? "Revenue (¥)" : "Orders"
                }
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gradRevenue)"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradOrders)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
