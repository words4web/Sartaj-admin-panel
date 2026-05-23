"use client";

import { useFormContext } from "react-hook-form";
import { Coins } from "lucide-react";
import {
  ConfigHeader,
  ConfigGrid,
  ConfigCard,
  NumericInputField,
} from "./ConfigCommon";

export function WalletTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const rewardError = (
    errors?.wallet as { rewardPercentage?: { message?: string } }
  )?.rewardPercentage;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ConfigHeader title="Wallet Rewards" icon={Coins} />

      <ConfigGrid className="md:grid-cols-2! max-w-xl">
        <ConfigCard title="Order Reward Rate">
          <NumericInputField
            label="Coins per order (%)"
            unit="%"
            unitPosition="right"
            register={register("wallet.rewardPercentage", {
              valueAsNumber: true,
              required: "Reward percentage is required",
              min: { value: 0, message: "Minimum is 0" },
              max: { value: 100, message: "Maximum is 100" },
            })}
            error={rewardError}
            min={0}
            step={1}
            max={100}
          />
          <p className="text-xs text-gray-500 mt-2">
            Reward is calculated from the order subtotal (product lines before
            shipping and tax). Set to 0 to disable coin rewards.
          </p>
        </ConfigCard>
      </ConfigGrid>
    </div>
  );
}
