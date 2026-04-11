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
import { Save, Package, Truck, MapPin, Percent } from "lucide-react";
import { MOVTab } from "./MOVTab";
import { ShippingRulesTab } from "./ShippingRulesTab";
import { SpecialAreasTab } from "./SpecialAreasTab";
import { TaxConfigTab } from "./TaxConfigTab";
import { TAX_CATEGORY, TAX_TYPE } from "@/services/appConfig/appConfig.service";

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
  {
    value: "tax",
    label: "Tax Settings",
    icon: Percent,
  },
];

export default function OrderSettings() {
  const { data: config, isLoading, error, refetch } = useAppConfig();
  const updateMutation = useUpdateAppConfig();

  const methods = useForm({
    mode: "onChange",
    defaultValues: config || {
      minOrderValues: [
        {
          superCategoryName: "Restaurant",
          value: 10000,
          penaltyCharge: 1500,
        },
        {
          superCategoryName: "Retailer",
          value: 6500,
          penaltyCharge: 1500,
        },
        {
          superCategoryName: "Wholesale",
          value: 15000,
          penaltyCharge: 2000,
        },
      ],
      shippingRules: {
        frozen: { weightThreshold: 5, fee: 1500 },
        dry: { threshold: 6500, fee: 1500 },
      },
      specialAreas: [],
      taxes: [
        { category: TAX_CATEGORY.REDUCED, value: 8 },
        { category: TAX_CATEGORY.STANDARD, value: 10 },
        { category: TAX_CATEGORY.CUSTOM, value: 1 },
      ],
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
          {/* Sticky Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 z-20 bg-white/95 backdrop-blur-md py-4 border-b border-gray-200">
            <TabsList className="bg-gray-100 p-1 rounded-lg h-auto">
              {orderTabs &&
                orderTabs?.map((tab) => (
                  <TabsTrigger
                    key={tab?.value}
                    value={tab?.value}
                    className="gap-2 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-sm font-medium">
                    <tab.icon className="w-4 h-4" /> {tab?.label}
                  </TabsTrigger>
                ))}
            </TabsList>

            <Button
              type="submit"
              size="lg"
              className="gap-2 h-11 px-6 rounded-lg text-sm font-semibold min-w-[140px]"
              disabled={updateMutation.isPending || !isValid}>
              <Save className="w-4 h-4" />
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

          <TabsContent value="tax" className="mt-0 focus-visible:outline-none">
            <TaxConfigTab />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}

