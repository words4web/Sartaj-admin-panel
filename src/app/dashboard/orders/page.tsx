"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { ROUTES } from "@/constants/routes";
import { useOrders } from "@/services/order/order.queries";
import { Order, OrderStatus } from "@/types/order/order.types";
import { FilterBar } from "@/components/common/FilterBar";
import { formatDateTime, formatYen } from "./_components/order.utils";

const statusVariant = (status: OrderStatus) => {
  if (status === "DELIVERED") return "success";
  if (status === "CANCELLED") return "destructive";
  return "secondary";
};

export default function OrdersPage() {
  const router = useRouter();
  const limit = 10;
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const { data, isLoading, isError, refetch } = useOrders({
    page,
    limit,
    status: status === "all" ? undefined : status,
  });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const columns: Column<Order>[] = useMemo(
    () => [
      { key: "orderId", label: "Order ID" },
      {
        key: "customer",
        label: "Customer",
        render: (_: any, row: Order) => {
          const customer =
            typeof row?.customer === "string" ? null : row?.customer;
          return customer?.fullName ?? "—";
        },
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
          <Badge variant={statusVariant(row?.status)}>{row?.status}</Badge>
        ),
      },
      {
        key: "paymentStatus",
        label: "Payment",
        render: (_: any, row: Order) => (
          <Badge variant={row?.paymentStatus === "COMPLETED" ? "success" : "secondary"}>
            {row?.paymentStatus}
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
              setPage(1);
            },
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Shipped", value: "SHIPPED" },
              { label: "Delivered", value: "DELIVERED" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
          },
        ]}
        onReset={() => {
          setStatus("all");
          setPage(1);
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{orders?.length}</span> of{" "}
            <span className="font-medium">{total}</span> orders
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
