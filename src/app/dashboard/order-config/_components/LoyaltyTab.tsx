"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Crown, Sparkles } from "lucide-react";
import {
  ConfigHeader,
  ConfigGrid,
  ConfigCard,
  NumericInputField,
} from "./ConfigCommon";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function LoyaltyTab() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const thresholdError = (
    errors?.loyalty as { qualificationThreshold?: { message?: string } }
  )?.qualificationThreshold;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ConfigHeader title="Sartaj Family Loyalty Program" icon={Crown} />

      <ConfigGrid className="md:grid-cols-2! max-w-4xl">
        <ConfigCard title="Qualification Threshold">
          <NumericInputField
            label="Cumulative Spend Required (¥)"
            unit="¥"
            unitPosition="left"
            register={register("loyalty.qualificationThreshold", {
              valueAsNumber: true,
              required: "Qualification threshold is required",
              min: {
                value: 30000,
                message: "Minimum qualification threshold is ¥30,000",
              },
            })}
            error={thresholdError}
            min={30000}
            step={1}
          />
          <p className="text-xs text-gray-500 mt-2">
            Customers qualify for Sartaj Family Loyalty once their cumulative
            delivered order subtotal reaches this amount.
          </p>
        </ConfigCard>

        <ConfigCard title="Weekend Promotion">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Double Points Weekend
                </Label>
                <p className="text-xs text-gray-500">
                  Double coin reward percentage for active loyalty members on
                  orders.
                </p>
              </div>
              <Controller
                name="loyalty.isDoublePointsWeekendActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </ConfigCard>
      </ConfigGrid>
    </div>
  );
}
