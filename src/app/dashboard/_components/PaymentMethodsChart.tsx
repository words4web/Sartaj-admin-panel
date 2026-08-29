"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { DashboardStats } from "@/types/dashboard.types";
import { formatPaymentMethod } from "@/utils/order.utils";

const PAYMENT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PaymentMethodsChart({
  paymentBreakdown,
}: {
  paymentBreakdown?: DashboardStats["paymentBreakdown"];
}) {
  const paymentData = useMemo(
    () =>
      paymentBreakdown?.map((item) => ({
        name: formatPaymentMethod(item?._id),
        rawName: item?._id,
        value: item?.count,
      })) || [],
    [paymentBreakdown],
  );

  return (
    <Card className="p-6 border-none shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp size={20} className="text-purple-500" />
        Payment Methods
      </h2>
      {!paymentData?.length ? (
        <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
          No data for this period.
        </div>
      ) : (
        <>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value">
                  {paymentData?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.12)",
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {paymentData?.map((entry, index) => (
              <div
                key={entry?.rawName}
                className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        PAYMENT_COLORS[index % PAYMENT_COLORS.length],
                    }}
                  />
                  <span className="text-gray-600">{entry?.name}</span>
                </div>
                <span className="font-bold text-gray-900">{entry?.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
