"use client";
import { OrderNotesCardProps } from "@/types/order/order.types";
import { MessageSquare } from "lucide-react";

export function OrderNotesCard({ notes }: OrderNotesCardProps) {
  if (!notes) return null;

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
      <div className="mb-4 border-b border-gray-100 pb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Customer's Notes
        </h3>
      </div>
      <p className="text-sm text-gray-700 bg-amber-50/50 py-4 px-5 rounded-xl border border-amber-100/50 leading-relaxed italic">
        {notes}
      </p>
    </div>
  );
}
