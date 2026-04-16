"use client";

import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order/order.types";
import { formatYen } from "./order.utils";

interface Props {
  order?: Order;
}

export function OrderSummaryCards({ order }: Props) {
  const customer = typeof order?.customer === "string" ? null : order?.customer;
  const customerName = customer?.fullName || order?.shippingAddress?.fullName || "Customer";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer Info Card */}
      <div className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Customer Details</p>
              <p className="text-xl font-bold text-gray-900">{customerName}</p>
              <p className="text-sm text-gray-500 mt-1">{customer?.mobileNumber || "No phone number"}</p>
            </div>
            <div className="bg-blue-50/50 p-2.5 rounded-full">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 bg-gray-50/60 p-3 rounded-xl border border-gray-100">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-100/50 text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Order: {order?.status ?? "—"}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-100/50 text-purple-700">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Payment: {order?.paymentStatus ?? "—"}
            </span>
          </div>
        </div>

        {order?.notes && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
            <p className="text-sm text-amber-900 bg-amber-50/70 py-2.5 px-3.5 rounded-xl border border-amber-100 italic leading-relaxed">
              {order?.notes}
            </p>
          </div>
        )}
      </div>

      {/* Order Math Card */}
      <div className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Payment Summary</p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">{formatYen(order?.subTotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Coupon Discount</span>
            <span className="font-semibold text-emerald-600">-{formatYen(order?.couponDiscount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Tax</span>
            <span className="font-semibold text-gray-900">{formatYen(order?.taxAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Shipping Fee</span>
            <span className="font-semibold text-gray-900">{formatYen(order?.shippingFee)}</span>
          </div>
          
          <div className="pt-4 mt-4 border-t border-dashed border-gray-200">
            <div className="flex justify-between items-center bg-gray-50/80 p-3 rounded-xl border border-gray-100">
              <span className="text-gray-500 text-sm font-medium">Payment Mode</span>
              <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
               <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
               Cash on Delivery
              </span>
            </div>
            <div className="flex justify-between items-center mt-4 px-1">
              <span className="font-bold text-gray-900">Grand Total</span>
              <span className="text-2xl font-black text-gray-900 tracking-tight">{formatYen(order?.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
