"use client";

import { BarChart3, Users, Package, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const STATS = [
  {
    label: "Total Customers",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Total Orders",
    value: "5,678",
    change: "+8%",
    icon: Package,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Revenue",
    value: "₹42,500",
    change: "+23%",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600",
  },
  {
    label: "Growth Rate",
    value: "18.5%",
    change: "+4.5%",
    icon: BarChart3,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-green-600 text-sm font-medium mt-2">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + i}</p>
                  <p className="text-sm text-gray-600">Customer {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{1000 * i}</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <a
              href="/dashboard/customers"
              className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-medium transition">
              Manage Customers
            </a>
            <a
              href="/dashboard/products"
              className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-medium transition">
              View Products
            </a>
            <a
              href="#"
              className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-medium transition">
              View Reports
            </a>
            <a
              href="#"
              className="block p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 font-medium transition">
              Settings
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
