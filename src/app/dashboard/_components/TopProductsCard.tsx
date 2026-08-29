"use client";

import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/types/dashboard.types";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export function TopProductsCard({
  topProducts,
}: {
  topProducts?: DashboardStats["topProducts"];
}) {
  const router = useRouter();

  return (
    <Card className="p-4 border border-gray-150/40 bg-white shadow-xs rounded-2xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
          <Trophy
            size={16}
            className="text-amber-500 fill-amber-100 animate-pulse"
          />
          Top 10 Selling Products
        </h2>
      </div>
      {!topProducts?.length ? (
        <p className="text-sm text-gray-400 py-6 text-center">
          No data for this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100/60 pb-2">
                <th className="pb-3 font-medium w-16 text-center">Rank</th>
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium w-24 text-right">Orders</th>
                <th className="pb-3 font-medium w-24 text-right">Qty Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts?.map((product, index) => {
                return (
                  <tr
                    key={product?.name}
                    onClick={() => {
                      if (product?.productId) {
                        router.push(ROUTES.PRODUCTS.DETAIL(product.productId));
                      }
                    }}
                    className="hover:bg-gray-50/50 transition duration-150 group cursor-pointer">
                    <td className="py-3 text-center">
                      <span className="inline-flex w-5.5 h-5.5 items-center justify-center text-[10px] rounded-lg border bg-gray-50 text-gray-500 border-gray-200/60 font-bold">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-gray-800 text-sm max-w-[280px] sm:max-w-[400px] truncate group-hover:text-primary transition-colors">
                      {product?.name}
                    </td>
                    <td className="py-3 text-right font-medium text-gray-500 text-sm">
                      {product?.orders}
                    </td>
                    <td className="py-3 text-right font-black text-gray-950 text-sm">
                      {product?.quantity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
