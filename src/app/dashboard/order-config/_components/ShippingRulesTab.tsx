"use client";

import { useFormContext } from "react-hook-form";
import { Truck } from "lucide-react";
import {
  ConfigHeader,
  ConfigGrid,
  ConfigCard,
  NumericInputField,
} from "./ConfigCommon";

export function ShippingRulesTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-8">
      <ConfigHeader title="Standard Shipping Rules" icon={Truck} />

      <ConfigGrid className="md:grid-cols-2!">
        {/* Frozen Rules */}
        <ConfigCard
          badge={{ text: "Frozen Goods", bgColor: "bg-blue-600" }}
          className="space-y-6">
          <NumericInputField
            className="mb-0"
            label="Free Shipping Weight Threshold"
            unit="kg"
            unitPosition="right"
            description="* If the total weight of frozen items in an order exceeds this limit, shipping is free."
            register={register("shippingRules.frozen.weightThreshold", {
              valueAsNumber: true,
              min: 0,
              required: true,
            })}
            error={(errors?.shippingRules as any)?.frozen?.weightThreshold}
            min={0}
          />

          <div className="pt-6 border-t border-gray-100">
            <NumericInputField
              className="mb-0"
              label="Delivery Fee (if below threshold)"
              unit="¥"
              register={register("shippingRules.frozen.fee", {
                valueAsNumber: true,
                min: 0,
                required: true,
              })}
              error={(errors?.shippingRules as any)?.frozen?.fee}
              min={0}
            />
          </div>
        </ConfigCard>

        {/* Dry Rules */}
        <ConfigCard
          badge={{ text: "Dry Goods", bgColor: "bg-green-700" }}
          className="space-y-6">
          <NumericInputField
            className="mb-0"
            label="Free Shipping Amount Threshold"
            unit="¥"
            description="* Orders with a subtotal greater than or equal to this qualify for free dry shipping."
            register={register("shippingRules.dry.threshold", {
              valueAsNumber: true,
              min: 0,
              required: true,
            })}
            error={(errors?.shippingRules as any)?.dry?.threshold}
            min={0}
          />

          <div className="pt-6 border-t border-gray-100">
            <NumericInputField
              label="Delivery Fee (if below threshold)"
              unit="¥"
              register={register("shippingRules.dry.fee", {
                valueAsNumber: true,
                min: 0,
                required: true,
              })}
              error={(errors?.shippingRules as any)?.dry?.fee}
              min={0}
            />
          </div>
        </ConfigCard>
      </ConfigGrid>
    </div>
  );
}
