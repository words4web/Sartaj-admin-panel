"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OrderStatus,
  PaymentStatus,
  OrderStatusUpdaterProps,
} from "@/types/order/order.types";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import {
  formatPaymentMethod,
  formatStatus,
  ORDER_STATUS_OPTIONS,
  paymentStatusVariant,
  statusVariant,
} from "@/utils/order.utils";
import { Wallet } from "lucide-react";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  payment_pending: [],
  placed: ["processing", "cancelled"],
  processing: ["dispatched", "cancelled"],
  dispatched: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function OrderStatusUpdater({
  order,
  status,
  paymentStatus,
  initialStatus,
  onStatusChange,
  onUpdate,
  isUpdating,
  disabled,
}: OrderStatusUpdaterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentConfirmOpen, setIsPaymentConfirmOpen] = useState(false);

  const allowedNextStatuses =
    VALID_TRANSITIONS[initialStatus as OrderStatus] || [];
  const filteredOptions = ORDER_STATUS_OPTIONS.filter(
    (option) =>
      option?.value === initialStatus ||
      allowedNextStatuses.includes(option?.value as OrderStatus),
  );

  const isStatusChanged = status !== initialStatus;
  const hasChanges = isStatusChanged;

  const handleUpdateClick = () => {
    if (!hasChanges) return;
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const payload: any = {};
    if (isStatusChanged) {
      payload.status = status;
    }

    onUpdate(payload);
    setIsModalOpen(false);
  };

  const handleConfirmPayment = () => {
    onUpdate({ paymentStatus: "paid" as PaymentStatus });
    setIsPaymentConfirmOpen(false);
  };

  const getConfirmationDescription = () => {
    return (
      <div className="space-y-3 pt-2">
        <p className="text-sm text-gray-500">
          Are you sure you want to perform the following updates?
        </p>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
          {isStatusChanged && (
            <div className="flex items-center gap-2 text-[18px]">
              <span className="font-bold text-gray-800 w-42">
                Order Status:
              </span>
              <span className="text-gray-600 line-through">
                {formatStatus(initialStatus as OrderStatus)}
              </span>
              <span className="text-gray-400">→</span>
              <span className="font-bold text-primary">
                {formatStatus(status as OrderStatus)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md h-full flex flex-col justify-between">
      <div>
        <div className="mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Update Status
          </h3>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3">
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-gray-900">
                Order Status
              </span>

              <Badge
                variant={statusVariant(initialStatus as OrderStatus)}
                className="h-7 w-fit rounded-lg px-3 text-[13px] font-semibold">
                {formatStatus(initialStatus as OrderStatus)}
              </Badge>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3">
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-gray-900">
                Payment Status
              </span>

              <Badge
                variant={paymentStatusVariant(paymentStatus as PaymentStatus)}
                className="h-7 w-fit rounded-lg px-3 text-[13px] font-semibold">
                {formatStatus(paymentStatus as PaymentStatus)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-end w-full">
          <div className="flex-1 min-w-[150px]">
            <label className="text-[12px] font-semibold text-gray-900 block mb-1">
              Order Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => onStatusChange(value as OrderStatus)}
              disabled={disabled || allowedNextStatuses?.length === 0}>
              <SelectTrigger className="bg-gray-50 w-full border-gray-200 rounded-xl h-10!">
                <SelectValue placeholder="Select order status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {filteredOptions?.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.value === initialStatus}
                    className="rounded-lg cursor-pointer capitalize">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleUpdateClick}
            disabled={
              disabled ||
              isUpdating ||
              !hasChanges ||
              allowedNextStatuses?.length === 0
            }
            className="h-10 rounded-xl font-bold bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-4">
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>

        {allowedNextStatuses?.length === 0 && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <svg
              className="w-4 h-4 text-amber-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-10a7 7 0 110 14A7 7 0 0112 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v4"
              />
            </svg>
            <span className="text-[12px] text-amber-600 font-semibold">
              {initialStatus === "payment_pending"
                ? "Status managed by payment system"
                : "Order status is locked — no further changes allowed"}
            </span>
          </div>
        )}

        {order?.paymentMethod === "daibiki" && paymentStatus === "unpaid" && (
          <div className="mt-4 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600 mt-0.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-emerald-900">
                  Cash on Delivery (Daibiki)
                </h4>
                <p className="text-[12px] text-emerald-700 leading-snug">
                  This order is Cash on Delivery. You can manually mark it as
                  paid once payment is collected.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsPaymentConfirmOpen(true)}
              disabled={isUpdating || disabled}
              className="w-full h-10 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm hover:shadow-emerald-100 cursor-pointer disabled:opacity-50">
              Mark as Paid
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gray-900" />
            <span className="text-[14px] font-semibold text-gray-900">
              Payment Method:
            </span>
          </div>
          <span className="font-black text-gray-900 text-sm">
            {formatPaymentMethod(order?.paymentMethod)}
          </span>
        </div>
      </div>

      <ConfirmModal
        open={isModalOpen}
        title="Confirm Status Change"
        description={getConfirmationDescription()}
        confirmLabel="Yes, Update"
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isUpdating}
      />

      <ConfirmModal
        open={isPaymentConfirmOpen}
        title="Confirm Payment Collection"
        description={
          <div className="space-y-3 pt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to mark this Cash on Delivery (Daibiki)
              order as **PAID**?
            </p>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-sm text-emerald-900">
              This action cannot be undone and will manually set the payment
              status to Paid.
            </div>
          </div>
        }
        confirmLabel="Yes, Mark as Paid"
        onConfirm={handleConfirmPayment}
        onCancel={() => setIsPaymentConfirmOpen(false)}
        isLoading={isUpdating}
      />
    </div>
  );
}
