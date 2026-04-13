"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Receipt } from "lucide-react";
import { TAX_CATEGORY } from "@/services/appConfig/appConfig.service";
import {
  ConfigHeader,
  ConfigGrid,
  ConfigCard,
  NumericInputField,
} from "./ConfigCommon";

const CATEGORY_LABELS: Record<TAX_CATEGORY, string> = {
  [TAX_CATEGORY.REDUCED]: "Reduced Tax (Food/Essentials)",
  [TAX_CATEGORY.STANDARD]: "Standard Tax (Alcohol/General)",
  [TAX_CATEGORY.CUSTOM]: "Custom/Special Category",
};

export function TaxConfigTab() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: "taxes",
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ConfigHeader title="Tax Configuration" icon={Receipt} />

      <ConfigGrid className="md:grid-cols-3!">
        {fields?.map((field, index) => {
          const category = watch(`taxes.${index}.category`) as TAX_CATEGORY;
          const error = (errors?.taxes as any)?.[index]?.value;

          return (
            <ConfigCard
              key={field?.id}
              title={CATEGORY_LABELS[category] || category}>
              <input type="hidden" {...register(`taxes.${index}.category`)} />

              <NumericInputField
                label="Tax Rate (%)"
                unit="%"
                unitPosition="right"
                register={register(`taxes.${index}.value`, {
                  valueAsNumber: true,
                  required: "Value is required",
                  min: { value: 1, message: "Minimum value is 1" },
                })}
                error={error}
                min={1}
              />
            </ConfigCard>
          );
        })}
      </ConfigGrid>
    </div>
  );
}
