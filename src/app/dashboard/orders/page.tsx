"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { ROUTES } from "@/constants/routes";
import { useOrders } from "@/services/order/order.queries";
import { Order, OrderStatus } from "@/types/order/order.types";
import { FilterBar } from "@/components/common/FilterBar";
import {
  formatDateTime,
  formatStatus,
  ORDER_STATUS_OPTIONS,
  paymentStatusVariant,
  resolveCustomerName,
  statusVariant,
} from "@/utils/order.utils";
import { formatYen } from "@/utils/common.utils";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const limit = Number(searchParams?.get("limit")) || 50;
  const page = Number(searchParams?.get("page")) || 1;
  const status = (searchParams?.get("status") as OrderStatus | "all") || "all";

  const updateParams = (
    updates: Record<string, string | number | null | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(updates)?.forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params?.toString()}`);
  };

  const setPage = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const setStatus = (newStatus: string) => {
    updateParams({
      status: newStatus === "all" ? null : newStatus,
      page: 1,
    });
  };

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useOrders({
    page,
    limit,
    status: status === "all" ? undefined : status,
  });

  const orders = response?.data ?? [];
  const total = response?.meta?.total ?? 0;
  const totalPages = response?.meta?.totalPages ?? 0;

  const columns: Column<Order>[] = useMemo(
    () => [
      { key: "orderId", label: "Order ID" },
      {
        key: "customer",
        label: "Customer",
        render: (_: any, row: Order) => resolveCustomerName(row),
      },
      {
        key: "totalAmount",
        label: "Total",
        render: (_: any, row: Order) => formatYen(row?.totalAmount),
      },
      {
        key: "status",
        label: "Status",
        render: (_: any, row: Order) => (
          <Badge variant={statusVariant(row?.status)}>
            {formatStatus(row?.status)}
          </Badge>
        ),
      },
      {
        key: "paymentStatus",
        label: "Payment",
        render: (_: any, row: Order) => (
          <Badge variant={paymentStatusVariant(row?.paymentStatus)}>
            {formatStatus(row?.paymentStatus)}
          </Badge>
        ),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (_: any, row: Order) => formatDateTime(row?.createdAt),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title="Orders"
        description="Track and manage order lifecycle"
        showBack={false}
      />

      <FilterBar
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (val) => {
              setStatus(val as OrderStatus | "all");
            },
            options: ORDER_STATUS_OPTIONS,
          },
        ]}
        onReset={() => {
          router.push(pathname);
        }}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onRowClick={(row) => {
            if (!row?._id) return;
            router.push(ROUTES.ORDERS.DETAIL(row._id));
          }}
        />
      </div>

      {total > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing <span className="font-medium">{orders?.length}</span> of{" "}
            <span className="font-medium">{total}</span> orders
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={limit}
            pageSizeOptions={[10, 20, 50]}
            onPageSizeChange={(newLimit) =>
              updateParams({
                limit: newLimit === 50 ? null : newLimit,
                page: 1,
              })
            }
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
