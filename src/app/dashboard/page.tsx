"use client";

import { useState, useMemo } from "react";
import { subDays, startOfDay } from "date-fns";
import { useDashboardQuery } from "@/services/dashboard/useDashboardQuery";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { DateRangeFilter, DATE_PRESETS } from "./_components/DateRangeFilter";
import { KpisGrid } from "./_components/KpisGrid";
import { RevenueTrendChart } from "./_components/RevenueTrendChart";
import { OrderStatusChart } from "./_components/OrderStatusChart";
import { PaymentMethodsChart } from "./_components/PaymentMethodsChart";
import { TopProductsCard } from "./_components/TopProductsCard";
import { RecentOrdersCard } from "./_components/RecentOrdersCard";

function getDateRange(days: number) {
  if (days === 0) {
    const today = startOfDay(new Date());
    return {
      from: today.toISOString(),
      to: new Date().toISOString(),
    };
  }
  return {
    from: subDays(new Date(), days).toISOString(),
    to: new Date().toISOString(),
  };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "analytics"
  >("overview");
  const [activePreset, setActivePreset] = useState<number>(0);
  const [dateRange, setDateRange] = useState<
    { from?: string; to?: string } | undefined
  >(undefined);

  const { data, isLoading, isError, error, refetch } =
    useDashboardQuery(dateRange);

  const cancellationRate = useMemo(() => {
    const kpis = data?.kpis;
    if (!kpis?.totalOrders) return "0.0";
    return ((kpis?.cancelledOrders / kpis?.totalOrders) * 100)?.toFixed(1);
  }, [data?.kpis]);

  const handlePreset = (days: number | null, index: number) => {
    setActivePreset(index);
    if (days === null) {
      setDateRange(undefined);
    } else {
      setDateRange(getDateRange(days));
    }
  };

  if (isLoading) return <CommonLoader fullScreen={false} />;
  if (isError)
    return (
      <CommonError
        message={error?.message}
        onRetry={() => refetch()}
        fullScreen={false}
      />
    );

  const activePresetLabel =
    activePreset !== null ? DATE_PRESETS[activePreset].label : undefined;

  return (
    <div className="space-y-6 p-4 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-gray-50/80 rounded-xl border border-gray-100/30">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
              activeTab === "overview"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-150/40"
            }`}>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
              activeTab === "orders"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-155/40"
            }`}>
            Trends & Status
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
              activeTab === "analytics"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-155/40"
            }`}>
            Products & Payments
          </button>
        </div>

        <DateRangeFilter
          activePreset={activePreset}
          onPresetChange={handlePreset}
        />
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <KpisGrid kpis={data?.kpis} cancellationRate={cancellationRate} />
          <RecentOrdersCard recentOrders={data?.recentOrders} />
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-6 animate-fade-in">
          <RevenueTrendChart
            data={data?.revenueByDay}
            activePresetLabel={activePresetLabel}
          />
          <OrderStatusChart statusBreakdown={data?.statusBreakdown} />
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6 animate-fade-in">
          <TopProductsCard topProducts={data?.topProducts} />
          <PaymentMethodsChart paymentBreakdown={data?.paymentBreakdown} />
        </div>
      )}
    </div>
  );
}
