"use client";

import {
  useAppConfig,
  useUpdateAppConfig,
} from "@/services/appConfig/appConfig.hooks";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { Save, Package, Truck, MapPin } from "lucide-react";
import { MOVTab } from "./MOVTab";
import { ShippingRulesTab } from "./ShippingRulesTab";
import { SpecialAreasTab } from "./SpecialAreasTab";

const orderTabs = [
  {
    value: "mov",
    label: "Minimum Order Values",
    icon: Package,
  },
  {
    value: "shipping",
    label: "Standard Shipping",
    icon: Truck,
  },
  {
    value: "special",
    label: "Special Areas",
    icon: MapPin,
  },
];

export default function OrderSettings() {
  const { data: config, isLoading, error, refetch } = useAppConfig();
  const updateMutation = useUpdateAppConfig();

  const methods = useForm({
    mode: "onChange",
    defaultValues: config || {
      minOrderValues: [],
      halalMinOrderValue: 15000,
      shippingRules: {
        frozen: { weightThreshold: 5, fee: 1500 },
        dry: { threshold: 6500, fee: 1500 },
      },
      specialAreas: [],
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (config) {
      reset(config);
    }
  }, [config, reset]);

  const onSubmit = (data: any) => {
    // Transform data to ensure database compatibility
    const transformedData = {
      ...data,
      minOrderValues: data?.minOrderValues?.map((item: any) => ({
        ...item,
        // Extract ID if superCategoryId is populated
        superCategoryId: item?.superCategoryId?._id || item?.superCategoryId,
        // Remove empty _id so MongoDB can generate a new one
        _id: item?._id === "" ? undefined : item?._id,
      })),
      specialAreas: data?.specialAreas?.map((item: any) => ({
        ...item,
        // Remove empty _id so MongoDB can generate a new one
        _id: item?._id === "" ? undefined : item?._id,
      })),
    };

    updateMutation.mutate(transformedData);
  };

  if (isLoading) return <CommonLoader message="Loading configurations..." />;
  if (error)
    return (
      <CommonError message="Failed to load configuration" onRetry={refetch} />
    );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
        <Tabs defaultValue="mov" className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 sticky top-0 z-20 bg-white/95 backdrop-blur-sm py-3 border-b border-gray-100">
            <TabsList className="bg-gray-100/70 p-1 rounded-xl border border-gray-200/50 h-auto">
              {orderTabs &&
                orderTabs?.map((tab) => (
                  <TabsTrigger
                    key={tab?.value}
                    value={tab?.value}
                    className="gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-200 font-semibold text-sm">
                    <tab.icon className="w-4.5 h-4.5" /> {tab?.label}
                  </TabsTrigger>
                ))}
            </TabsList>

            <Button
              type="submit"
              size="lg"
              className="gap-2 h-auto shadow-lg shadow-blue-100 px-6 py-3 rounded-lg text-sm font-bold min-w-[140px] transition-transform active:scale-95"
              disabled={updateMutation.isPending || !isValid}>
              <Save className="w-4.5 h-4.5" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <TabsContent value="mov" className="mt-0 focus-visible:outline-none">
            <MOVTab config={config} />
          </TabsContent>

          <TabsContent
            value="shipping"
            className="mt-0 focus-visible:outline-none">
            <ShippingRulesTab />
          </TabsContent>

          <TabsContent
            value="special"
            className="mt-0 focus-visible:outline-none">
            <SpecialAreasTab />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
