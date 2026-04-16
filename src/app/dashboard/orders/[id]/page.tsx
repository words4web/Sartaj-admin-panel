"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { useOrder } from "@/services/order/order.queries";
import { useUpdateOrderStatus } from "@/services/order/order.mutations";
import { OrderStatus, PaymentStatus } from "@/types/order/order.types";
import { OrderSummaryCards } from "../_components/OrderSummaryCards";
import { OrderStatusUpdater } from "../_components/OrderStatusUpdater";
import { OrderItemsList } from "../_components/OrderItemsList";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();

  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");

  const onUpdate = () => {
    if (!id || (!status && !paymentStatus)) return;

    updateStatus.mutate({
      id,
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
      },
    });
  };

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title={order?.orderId ? `Order ${order.orderId}` : "Order Details"}
        description="View order snapshot and update lifecycle statuses"
      />

      {isLoading ? (
        <CommonLoader fullScreen={false} />
      ) : isError ? (
        <CommonError onRetry={refetch} />
      ) : !order ? (
        <div className="bg-white border rounded-lg p-6 text-sm text-gray-500">
          Order not found.
        </div>
      ) : (
        <>
          <OrderSummaryCards order={order} />
          {/* <OrderStatusUpdater
            status={status}
            paymentStatus={paymentStatus}
            onStatusChange={setStatus}
            onPaymentStatusChange={setPaymentStatus}
            onUpdate={onUpdate}
            isUpdating={updateStatus.isPending}
            disabled={!id}
          /> */}
          <OrderItemsList items={order?.items} />
        </>
      )}
    </div>
  );
}
