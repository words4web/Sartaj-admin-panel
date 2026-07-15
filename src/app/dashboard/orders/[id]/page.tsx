"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { useOrder } from "@/services/order/order.queries";
import {
  useUpdateOrderStatus,
  useUpdateOrderTracking,
  useUpdateOrderDeliveryTerms,
} from "@/services/order/order.mutations";
import { OrderStatus } from "@/types/order/order.types";
import { CustomerInfoCard } from "../_components/CustomerInfoCard";
import { PaymentBreakdownCard } from "../_components/PaymentBreakdownCard";
import { OrderStatusUpdater } from "../_components/OrderStatusUpdater";
import { OrderItemsList } from "../_components/OrderItemsList";
import { OrderNotesCard } from "../_components/OrderNotesCard";
import { UpdateTrackingModal } from "../_components/UpdateTrackingModal";
import { EditHistoryCard } from "../_components/EditHistoryCard";
import { Button } from "@/components/ui/button";
import { Eye, Truck, Edit } from "lucide-react";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { dateUtils } from "@/utils/common.utils";

const slotMap: Record<string, string> = {
  "1": "09:00 AM - 12:00 PM",
  "2": "12:00 PM - 03:00 PM",
  "3": "03:00 PM - 06:00 PM",
  "4": "06:00 PM - 09:00 PM",
};

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updateTracking = useUpdateOrderTracking();
  const updateDeliveryTerms = useUpdateOrderDeliveryTerms();

  const [status, setStatus] = useState<OrderStatus | "">("");
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [deliveryTermsInput, setDeliveryTermsInput] = useState("");

  // Sync state when order data is loaded
  useEffect(() => {
    if (order) {
      setStatus(order?.status);
      setDeliveryTermsInput(order?.deliveryTerms || "");
    }
  }, [order]);

  const handleSaveDeliveryTerms = () => {
    const trimmedInput = deliveryTermsInput
      ?.split("\n")
      ?.map((line) => line?.trim())
      ?.join("\n");
    updateDeliveryTerms.mutate({
      id,
      data: { deliveryTerms: trimmedInput },
    });
  };

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

          {order &&
            (order?.status === "placed" || order?.status === "processing") && (
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/orders/${id}/edit`)}
                className="h-10 rounded-xl font-bold border-gray-200 text-primary hover:text-primary hover:bg-primary/5 cursor-pointer flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit Order
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
          {(order?.deliveryDate || order?.deliverySlot) && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-100/90 text-amber-850 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                    Customer Delivery Schedule Request
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  </h4>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">
                    The customer specified when they would like to receive this
                    order.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {order?.deliveryDate && (
                  <div className="bg-white px-4 py-2.5 rounded-xl border border-amber-200/60 flex flex-col min-w-[140px]">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                      Date
                    </span>
                    <span className="text-sm font-black text-gray-900 mt-0.5">
                      {dateUtils.format(order?.deliveryDate, "MMMM DD, YYYY")}
                    </span>
                  </div>
                )}
                {order?.deliverySlot && (
                  <div className="bg-white px-4 py-2.5 rounded-xl border border-amber-200/60 flex flex-col min-w-[160px]">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                      Time Window
                    </span>
                    <span className="text-sm font-black text-gray-900 mt-0.5">
                      {slotMap[order?.deliverySlot] || order?.deliverySlot}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top Summary Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CustomerInfoCard order={order} />

            <OrderStatusUpdater
              order={order}
              status={status}
              paymentStatus={order?.paymentStatus || ""}
              initialStatus={order?.status || ""}
              onStatusChange={setStatus}
              onUpdate={(data) => updateStatus.mutate({ id, data })}
              isUpdating={updateStatus.isPending}
              disabled={!id}
            />

            <PaymentBreakdownCard order={order} />
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
            <OrderItemsList items={order?.items} />

            {/* Free Gift Product */}
            {order?.giftProduct && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 transition-all hover:shadow-md">
                <div className="mb-4 border-b border-emerald-100/50 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    <h3 className="text-lg font-bold text-emerald-900 tracking-tight">
                      Free Checkout Gift
                    </h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Free
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {order?.giftProduct.images?.[0] && (
                    <div className="w-16 h-16 rounded-xl bg-white border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-sm">
                      <img
                        src={order?.giftProduct?.images?.[0]}
                        alt={order?.giftProduct?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {order?.giftProduct?.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      SKU: {order?.giftProduct?.sku}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Terms Card */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
              <div className="mb-4 border-b border-gray-100 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    Invoice Terms of Delivery (Optional Notes)
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                <textarea
                  rows={4}
                  placeholder="Enter custom delivery instructions or notes to append to the invoice PDF (e.g. Leave package by the door, delivery after 5 PM, etc.)"
                  value={deliveryTermsInput}
                  onChange={(e) => setDeliveryTermsInput(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-black bg-white"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveDeliveryTerms}
                    disabled={
                      updateDeliveryTerms.isPending ||
                      deliveryTermsInput === (order?.deliveryTerms || "")
                    }
                    className="h-10 px-5 rounded-xl font-bold cursor-pointer transition-all">
                    {updateDeliveryTerms.isPending
                      ? "Updating Invoice..."
                      : "Update Invoice PDF"}
                  </Button>
                </div>
              </div>
            </div>

            <OrderNotesCard notes={order?.notes} />

            <EditHistoryCard history={order?.editHistory} />
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
