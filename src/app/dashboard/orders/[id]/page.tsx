"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { useOrder } from "@/services/order/order.queries";
import {
  useUpdateOrderStatus,
  useUpdateOrderTracking,
} from "@/services/order/order.mutations";
import { OrderStatus, PaymentStatus } from "@/types/order/order.types";
import { CustomerInfoCard } from "../_components/CustomerInfoCard";
import { PaymentBreakdownCard } from "../_components/PaymentBreakdownCard";
import { OrderStatusUpdater } from "../_components/OrderStatusUpdater";
import { OrderItemsList } from "../_components/OrderItemsList";
import { OrderNotesCard } from "../_components/OrderNotesCard";
import { UpdateTrackingModal } from "../_components/UpdateTrackingModal";
import { Button } from "@/components/ui/button";
import { Eye, Truck } from "lucide-react";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { dateUtils } from "@/utils/common.utils";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updateTracking = useUpdateOrderTracking();

  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Sync state when order data is loaded
  useEffect(() => {
    if (order) {
      setStatus(order?.status);
      setPaymentStatus(order?.paymentStatus);
    }
  }, [order]);

  const handleUpdateTracking = (trackOrder: string) => {
    updateTracking.mutate(
      { id, data: { trackOrder } },
      {
        onSuccess: () => {
          setIsTrackingModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <PageHeader
          title={order?.orderId ? `${order?.orderId}` : "Order Details"}
          description={
            order?.createdAt
              ? `Placed on ${dateUtils.format(order.createdAt, "MMMM DD, YYYY")} at ${dateUtils.formatTime(order.createdAt, "hh:mm A")}`
              : "View order snapshot"
          }
        />

        <div className="flex items-center gap-3 flex-wrap">
          {order?.invoiceURL && (
            <Button
              variant="outline"
              onClick={() => window.open(order?.invoiceURL, "_blank")}
              className="h-10 rounded-xl font-bold border-gray-200 text-emerald-600 hover:text-emerald-700 cursor-pointer hover:bg-emerald-50 flex items-center gap-2">
              <Eye className="w-4 h-4" /> View Invoice
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setIsTrackingModalOpen(true)}
            className="h-10 rounded-xl font-bold border-gray-200 text-blue-600 hover:text-blue-700 cursor-pointer hover:bg-blue-50 flex items-center gap-2">
            <Truck className="w-4 h-4" /> Update Tracking
          </Button>
        </div>
      </div>

      {isLoading ? (
        <CommonLoader fullScreen={false} />
      ) : isError ? (
        <CommonError message="Failed to load order details" onRetry={refetch} />
      ) : !order ? (
        <div className="bg-white border rounded-lg p-6 text-sm text-gray-500">
          Order not found.
        </div>
      ) : (
        <div className="space-y-8 mt-2">
          {/* Top Summary Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CustomerInfoCard order={order} />

            <OrderStatusUpdater
              status={status}
              paymentStatus={paymentStatus}
              initialStatus={order?.status || ""}
              initialPaymentStatus={order?.paymentStatus || ""}
              onStatusChange={setStatus}
              onPaymentStatusChange={setPaymentStatus}
              onUpdate={(data) => updateStatus.mutate({ id, data })}
              isUpdating={updateStatus.isPending}
              disabled={!id}
            />

            <PaymentBreakdownCard order={order} />
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
            <OrderItemsList items={order?.items} />

            <OrderNotesCard notes={order?.notes} />
          </div>
        </div>
      )}

      <UpdateTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        currentTrackingNumber={order?.trackOrder}
        onUpdate={handleUpdateTracking}
        isLoading={updateTracking.isPending}
      />
    </div>
  );
}
