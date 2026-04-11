"use client";

import {
  Controller,
  useFormContext,
  useFieldArray,
  useFormState,
} from "react-hook-form";
import {
  ConfigHeader,
  ConfigGrid,
  ConfigCard,
  NumericInputField,
} from "./ConfigCommon";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  fetchPrefectures,
  getPrefectureName,
} from "@/constants/prefectures";
import { PaginatedDropdown } from "@/components/common/PaginatedDropdown";

export function SpecialAreasTab() {
  const { register, control } = useFormContext();
  const { errors } = useFormState({ control });
  const {
    fields: specialAreaFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "specialAreas",
  });

  return (
    <div className="space-y-8">
      <ConfigHeader
        title="Special Delivery Areas (Flat Fee)"
        icon={MapPin}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", fee: 2000 })}
            className="gap-2 font-semibold">
            <Plus className="w-4 h-4" /> Add Special Area
          </Button>
        }
      />

      <ConfigGrid>
        {specialAreaFields?.map((field, index) => (
          <ConfigCard
            key={field?.id}
            title={`Zone #${index + 1}`}
            onRemove={() => remove(index)}>
            <input
              type="hidden"
              {...register(`specialAreas.${index}._id` as const)}
            />

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-900 tracking-wider block">
                  Select Prefecture
                </Label>
                <Controller
                  control={control}
                  name={`specialAreas.${index}.name` as const}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <PaginatedDropdown
                      value={value}
                      onValueChange={onChange}
                      fetchData={fetchPrefectures}
                      queryKey={["prefectures", "dropdown"]}
                      placeholder="Select Prefecture"
                      searchPlaceholder="Search prefectures..."
                      selectedLabel={getPrefectureName(value)}
                    />
                  )}
                />
              </div>

              <NumericInputField
                label="Flat Delivery Fee"
                unit="¥"
                register={register(`specialAreas.${index}.fee` as const, {
                  valueAsNumber: true,
                  min: 0,
                  required: true,
                })}
                error={(errors?.specialAreas as any)?.[index]?.fee}
                min={0}
              />
            </div>
          </ConfigCard>
        ))}

        {specialAreaFields?.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-gray-400">
            <MapPin className="w-10 h-10 mx-auto mb-4 opacity-20" />
            <p className="text-sm font-semibold text-gray-600">
              No special areas defined.
            </p>
            <p className="text-xs mt-1 text-gray-900">
              Standard shipping rules apply to all regions.
            </p>
          </div>
        )}
      </ConfigGrid>
    </div>
  );
}
