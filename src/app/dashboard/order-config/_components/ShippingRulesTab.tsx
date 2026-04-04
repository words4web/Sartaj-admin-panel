"use client";

import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";

export function ShippingRulesTab() {
  const { register } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-xl font-bold text-gray-900 border-b pb-3">
        <Truck className="w-6 h-6 text-blue-600" />
        Standard Shipping Rules
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Frozen Rules */}
        <Card className="p-6 space-y-6 relative overflow-hidden border-blue-100 bg-blue-50/5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 bg-blue-600 text-white rounded-bl-3xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest pl-4">
              Frozen Goods
            </span>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-bold text-black uppercase tracking-widest">
                Free Shipping Weight Threshold
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  required
                  {...register("shippingRules.frozen.weightThreshold", {
                    valueAsNumber: true,
                    min: 0,
                    required: true,
                  })}
                  className="pr-10 py-5 text-lg font-bold border-blue-200 focus-visible:ring-blue-500 rounded-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-base">
                  kg
                </span>
              </div>
              <p className="text-xs text-black font-medium italic">
                * Orders weighing more than this will qualify for free frozen
                shipping.
              </p>
            </div>
            <div className="space-y-4 pt-4 border-t border-blue-100/50">
              <Label className="text-sm font-bold text-black uppercase tracking-widest">
                Delivery Fee (if below threshold)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">
                  ¥
                </span>
                <Input
                  type="number"
                  min="0"
                  required
                  {...register("shippingRules.frozen.fee", {
                    valueAsNumber: true,
                    min: 0,
                    required: true,
                  })}
                  className="pl-10 py-5 text-lg font-bold border-blue-200 focus-visible:ring-blue-500 rounded-lg"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Dry Rules */}
        <Card className="p-6 space-y-6 relative overflow-hidden border-green-100 bg-green-50/5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 bg-green-600 text-white rounded-bl-3xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest pl-4">
              Dry Goods
            </span>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-bold text-black uppercase tracking-widest">
                Free Shipping Amount Threshold
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">
                  ¥
                </span>
                <Input
                  type="number"
                  min="0"
                  required
                  {...register("shippingRules.dry.threshold", {
                    valueAsNumber: true,
                    min: 0,
                    required: true,
                  })}
                  className="pl-10 py-5 text-lg font-bold border-green-200 focus-visible:ring-green-500 rounded-lg"
                />
              </div>
              <p className="text-xs text-black font-medium italic">
                * Orders with a subtotal higher than this will qualify for free
                dry shipping.
              </p>
            </div>
            <div className="space-y-4 pt-4 border-t border-green-100/50">
              <Label className="text-sm font-bold text-black uppercase tracking-widest">
                Delivery Fee (if below threshold)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">
                  ¥
                </span>
                <Input
                  type="number"
                  min="0"
                  required
                  {...register("shippingRules.dry.fee", {
                    valueAsNumber: true,
                    min: 0,
                    required: true,
                  })}
                  className="pl-10 py-5 text-lg font-bold border-green-200 focus-visible:ring-green-500 rounded-lg"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
