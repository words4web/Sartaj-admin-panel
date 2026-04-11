"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Package } from "lucide-react";
import {
  ConfigHeader,
  ConfigGrid,
  ConfigCard,
  NumericInputField,
} from "./ConfigCommon";

export function MOVTab({ config }: { config: any }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { fields: movFields } = useFieldArray({
    control,
    name: "minOrderValues",
  });

  return (
    <div className="space-y-8">
      <ConfigHeader title="General Minimum Order Values (MOV)" icon={Package} />

      <ConfigGrid className="xl:grid-cols-3">
        {movFields?.map((field, index) => (
          <ConfigCard
            key={field?.id}
            title={`${
              config?.minOrderValues?.[index]?.superCategoryName || "Category"
            } Settings`}>
            <input
              type="hidden"
              {...register(`minOrderValues.${index}._id` as const)}
            />
            <input
              type="hidden"
              {...register(`minOrderValues.${index}.superCategoryId` as const)}
            />
            <input
              type="hidden"
              {...register(
                `minOrderValues.${index}.superCategoryName` as const,
              )}
            />

            <div className="space-y-6">
              <NumericInputField
                label="Minimum Order Value (MOV)"
                unit="¥"
                register={register(`minOrderValues.${index}.value`, {
                  valueAsNumber: true,
                  min: 0,
                  required: true,
                })}
                error={(errors?.minOrderValues as any)?.[index]?.value}
                min={0}
              />

              <NumericInputField
                label="Penalty Charge (if below MOV)"
                unit="¥"
                register={register(`minOrderValues.${index}.penaltyCharge`, {
                  valueAsNumber: true,
                  min: { value: 1, message: "Min 1" },
                  required: true,
                })}
                error={(errors?.minOrderValues as any)?.[index]?.penaltyCharge}
                min={1}
              />
            </div>
          </ConfigCard>
        ))}
      </ConfigGrid>
    </div>
  );
}
