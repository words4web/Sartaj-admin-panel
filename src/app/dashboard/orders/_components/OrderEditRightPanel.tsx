"use client";

import { Percent, AlertCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderEditRightPanelProps } from "@/types/order/order.types";
import { OrderEditOriginalPrice } from "./OrderEditOriginalPrice";
import { OrderEditPriceComparison } from "./OrderEditPriceComparison";

export function OrderEditRightPanel({
  order,
  couponCode,
  setCouponCode,
  setValidationResult,
  validationResult,
  validationError,
  isValidating,
  isSaving,
  handleValidate,
  handleSave,
  itemsLength,
}: OrderEditRightPanelProps) {
  return (
    <div className="space-y-6">
      {/* Coupon Code Card */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-md font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-3">
          <Percent className="w-4 h-4 text-primary" /> Promotional Discount
        </h3>
        <div className="space-y-2">
          <Label htmlFor="coupon" className="text-xs font-bold text-gray-500">
            Coupon Code
          </Label>
          <Input
            id="coupon"
            placeholder="Enter coupon code (e.g. SAVE10)"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setValidationResult(null);
            }}
            className="rounded-xl border-gray-200 focus:border-primary text-black bg-white"
          />
        </div>
      </div>

      {/* Validation Warnings / Error */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-800 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div className="text-xs font-semibold leading-relaxed">
            {validationError}
          </div>
        </div>
      )}

      {/* Initial/Original price breakdown (if not validated yet) */}
      {!validationResult && order && (
        <OrderEditOriginalPrice
          orderSnapshot={order?.calculationSnapshot}
          totalAmount={order?.totalAmount}
        />
      )}

      {/* Validation Success Breakdown */}
      {validationResult && (
        <OrderEditPriceComparison
          orderSnapshot={order?.calculationSnapshot}
          validationResult={validationResult}
          originalTotalAmount={order?.totalAmount || 0}
        />
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!validationResult ? (
          <Button
            type="button"
            onClick={handleValidate}
            disabled={itemsLength === 0 || isValidating}
            className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2">
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Validate Changes"
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
