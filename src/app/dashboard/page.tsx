"use client";

import { useEffect } from "react";
import { Users, Package, TrendingUp, ShoppingBag, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDashboardQuery } from "@/services/dashboard/useDashboardQuery";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useDashboardQuery();

  useEffect(() => {
    document.title = "Dashboard | Sartaj Admin";
  }, []);

  if (isLoading) return <CommonLoader fullScreen={false} />;
  if (isError)
    return (
      <CommonError
        message={error?.message}
        onRetry={() => refetch()}
        fullScreen={false}
      />
    );

  const kpis = data?.kpis;
  const statusData = data?.statusBreakdown?.map((item) => ({
    name: item?._id,
    value: item?.count,
  }));
  const paymentData = data?.paymentBreakdown?.map((item) => ({
    name: item?._id,
    value: item?.count,
  }));

  const statCards = [
    {
      label: "Total Revenue",
      value: `¥${kpis?.totalRevenue?.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Orders",
      value: kpis?.totalOrders?.toLocaleString(),
      icon: ShoppingBag,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Customers",
      value: kpis?.totalCustomers?.toLocaleString(),
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pending Orders",
      value: kpis?.pendingOrders?.toLocaleString(),
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's a real-time overview of your business.
          </p>
        </div>
        <div className="text-sm text-gray-400 font-medium">
          Last updated: {format(new Date(), "PPpp")}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards?.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} shadow-sm`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <Card className="lg:col-span-2 p-6 border-none shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package size={20} className="text-blue-500" />
            Order Status Breakdown
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
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
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods Section */}
        <Card className="p-6 border-none shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-500" />
            Payment Methods
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value">
                  {paymentData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {paymentData?.map((entry, index) => (
              <div
                key={entry?.name}
                className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600 capitalize">
                    {entry?.name}
                  </span>
                </div>
                <span className="font-bold text-gray-900">{entry?.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Section */}
        <Card className="lg:col-span-3 p-6 border-none shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag size={20} className="text-green-500" />
              Recent Orders
            </h2>
            <button
              onClick={() => {
                router.push(ROUTES.ORDERS.LIST);
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.recentOrders?.map((order) => (
                  <tr
                    key={order?._id}
                    onClick={() => {
                      router.push(ROUTES.ORDERS.DETAIL(order?._id));
                    }}
                    className="hover:bg-gray-50/50 transition cursor-pointer">
                    <td className="py-4 font-bold text-gray-900">
                      #{order?.orderId}
                    </td>
                    <td className="py-4 text-gray-600 font-medium">
                      {order?.customerName || "Walk-in Customer"}
                    </td>
                    <td className="py-4 text-gray-500 text-sm">
                      {format(new Date(order?.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 font-bold text-gray-900">
                      ¥{order?.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                        ${
                          order?.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order?.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}>
                        {order?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
