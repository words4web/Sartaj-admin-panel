"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MapPin } from "lucide-react";

export function SpecialAreasTab() {
  const { register, control } = useFormContext();
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
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3 text-xl font-bold text-gray-900 leading-none">
          <div className="p-2 bg-blue-50 rounded-lg">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          Special Delivery Areas (Flat Fee)
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => append({ name: "", fee: 2000 })}
          className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm font-semibold">
          <Plus className="w-5 h-5" /> Add Special Area
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {specialAreaFields?.map((field, index) => (
          <Card
            key={field?.id}
            className="p-5 space-y-4 group hover:border-blue-200 hover:shadow-md transition-all duration-300 relative border-gray-100 shadow-sm bg-white overflow-hidden">
            <input
              type="hidden"
              {...register(`specialAreas.${index}._id` as const)}
            />
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/10 group-hover:bg-blue-500 transition-colors" />

            <div className="flex justify-between items-center border-b border-gray-200">
              <span className="text-[10px] font-bold text-black uppercase tracking-widest leading-none">
                Zone Details #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-gray-300 hover:text-red-500 transition-colors p-2 pt-0 hover:bg-red-50 rounded-lg"
                title="Remove Area">
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                  Prefecture or City Name
                </label>
                <Input
                  placeholder="e.g. Okinawa"
                  required
                  {...register(`specialAreas.${index}.name` as const, {
                    required: true,
                  })}
                  className="h-10 text-sm font-bold bg-gray-50/30 border-gray-100 focus:bg-white focus:ring-blue-500 transition-all placeholder:font-normal placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest leading-none">
                  Flat Delivery Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                    ¥
                  </span>
                  <Input
                    type="number"
                    min="0"
                    required
                    placeholder="2000"
                    {...register(`specialAreas.${index}.fee` as const, {
                      valueAsNumber: true,
                      min: 0,
                      required: true,
                    })}
                    className="pl-8 h-10 text-sm font-bold border-gray-100 bg-gray-50/10 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        {specialAreaFields?.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-4xl bg-gray-50/50 text-gray-400">
            <div className="p-4 bg-white rounded-full w-fit mx-auto mb-4 border border-gray-100 shadow-sm">
              <MapPin className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-bold text-gray-500">
              No special areas defined.
            </p>
            <p className="text-xs mt-2 max-w-xs mx-auto text-gray-400 leading-relaxed uppercase tracking-tighter font-medium">
              Standard shipping rules will automatically apply to all other
              regions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
