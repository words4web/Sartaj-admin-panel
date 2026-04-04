"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Tag } from "lucide-react";

export function MOVTab({ config }: { config: any }) {
  const { register, control } = useFormContext();
  const { fields: movFields } = useFieldArray({
    control,
    name: "minOrderValues",
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-xl font-bold text-gray-900 border-b pb-3">
        <Package className="w-6 h-6 text-blue-600" />
        General Minimum Order Values (MOV)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {movFields?.map((field, index) => (
          <Card
            key={field?.id}
            className="p-5 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-t-blue-500/20">
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

            <Label className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest block">
              {config?.minOrderValues[index]?.superCategoryName} MOV
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-base">
                ¥
              </span>
              <Input
                type="number"
                min="0"
                required
                {...register(`minOrderValues.${index}.value` as const, {
                  valueAsNumber: true,
                  min: 0,
                  required: true,
                })}
                className="pl-8 py-5 text-lg font-bold border-gray-200 focus-visible:ring-blue-500 rounded-lg"
              />
            </div>
          </Card>
        ))}

        <Card className="p-5 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-t-blue-500/20">
          <Label className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest">
            <Tag className="w-4 h-4" />
            Halal Products MOV
          </Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-base">
              ¥
            </span>
            <input type="hidden" {...register("_id")} />
            <Input
              type="number"
              min="0"
              required
              {...register("halalMinOrderValue", {
                valueAsNumber: true,
                min: 0,
                required: true,
              })}
              className="pl-8 py-5 text-lg font-bold border-gray-200 focus-visible:ring-blue-500 rounded-lg bg-white"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
