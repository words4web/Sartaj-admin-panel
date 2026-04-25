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
  formatStatus,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  paymentStatusVariant,
  statusVariant,
} from "@/utils/order.utils";

export function OrderStatusUpdater({
  status,
  paymentStatus,
  initialStatus,
  initialPaymentStatus,
  onStatusChange,
  onPaymentStatusChange,
  onUpdate,
  isUpdating,
  disabled,
}: OrderStatusUpdaterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isStatusChanged = status !== initialStatus;
  const isPaymentStatusChanged = paymentStatus !== initialPaymentStatus;
  const hasChanges = isStatusChanged || isPaymentStatusChanged;

  const handleUpdateClick = () => {
    if (!hasChanges) return;
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const payload: any = {};
    if (isStatusChanged) payload.status = status;
    if (isPaymentStatusChanged) payload.paymentStatus = paymentStatus;

    onUpdate(payload);
    setIsModalOpen(false);
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
          {isPaymentStatusChanged && (
            <div className="flex items-center gap-2 text-[18px]">
              <span className="font-bold text-gray-800 w-42">
                Payment Status:
              </span>
              <span className="text-gray-600 line-through">
                {formatStatus(initialPaymentStatus as PaymentStatus)}
              </span>
              <span className="text-gray-400">→</span>
              <span className="font-bold text-primary">
                {formatStatus(paymentStatus as PaymentStatus)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md h-full flex flex-col">
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

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Badge
          variant={statusVariant(initialStatus as OrderStatus)}
          className="h-7 px-3 text-[14px] font-bold uppercase tracking-wider">
          {formatStatus(initialStatus as OrderStatus)}
        </Badge>
        <Badge
          variant={paymentStatusVariant(initialPaymentStatus as PaymentStatus)}
          className="h-7 px-3 text-[14px] font-bold uppercase tracking-wider">
          {formatStatus(initialPaymentStatus as PaymentStatus)}
        </Badge>
      </div>

      <div className="flex flex-col gap-5 flex-grow">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">
            Order Status
          </label>
          <Select
            value={status}
            onValueChange={(value) => onStatusChange(value as OrderStatus)}>
            <SelectTrigger
              disabled={disabled}
              className="bg-gray-50 border-gray-200 rounded-xl h-12 w-full">
              <SelectValue placeholder="Select order status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {ORDER_STATUS_OPTIONS.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="rounded-lg cursor-pointer capitalize">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">
            Payment Status
          </label>
          <Select
            value={paymentStatus}
            onValueChange={(value) =>
              onPaymentStatusChange(value as PaymentStatus)
            }>
            <SelectTrigger
              disabled={disabled}
              className="bg-gray-50 border-gray-200 rounded-xl h-12 w-full">
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {PAYMENT_STATUS_OPTIONS.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="rounded-lg cursor-pointer capitalize">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-auto">
          <Button
            onClick={handleUpdateClick}
            disabled={disabled || isUpdating || !hasChanges}
            className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
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
    </div>
  );
}
