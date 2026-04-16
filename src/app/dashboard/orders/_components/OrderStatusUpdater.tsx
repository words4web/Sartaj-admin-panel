"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus, PaymentStatus } from "@/types/order/order.types";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["PENDING", "COMPLETED", "FAILED"];

interface Props {
  status: OrderStatus | "";
  paymentStatus: PaymentStatus | "";
  onStatusChange: (value: OrderStatus) => void;
  onPaymentStatusChange: (value: PaymentStatus) => void;
  onUpdate: () => void;
  isUpdating: boolean;
  disabled?: boolean;
}

export function OrderStatusUpdater({
  status,
  paymentStatus,
  onStatusChange,
  onPaymentStatusChange,
  onUpdate,
  isUpdating,
  disabled,
}: Props) {
  return (
    <div className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Update Status</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Order Status</label>
          <Select value={status} onValueChange={(value) => onStatusChange(value as OrderStatus)}>
            <SelectTrigger disabled={disabled} className="bg-gray-50 border-gray-200 rounded-xl h-12">
              <SelectValue placeholder="Select order status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {ORDER_STATUSES.map((item) => (
                <SelectItem key={item} value={item} className="rounded-lg cursor-pointer">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Payment Status</label>
          <Select value={paymentStatus} onValueChange={(value) => onPaymentStatusChange(value as PaymentStatus)}>
            <SelectTrigger disabled={disabled} className="bg-gray-50 border-gray-200 rounded-xl h-12">
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {PAYMENT_STATUSES.map((item) => (
                <SelectItem key={item} value={item} className="rounded-lg cursor-pointer">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button 
            onClick={onUpdate} 
            disabled={disabled || isUpdating}
            className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
