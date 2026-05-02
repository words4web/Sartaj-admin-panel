"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { useSubCategoryById } from "@/services/subCategory/subCategory.hooks";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { ICategory } from "@/types/category/category.types";
import { TranslationDisplay } from "@/components/common/TranslationDisplay";

const SUBCATEGORY_FIELDS = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

export default function SubCategoryDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: subCategoryDetails,
    isLoading,
    isError,
    refetch,
  } = useSubCategoryById(id);

  // Cast because data might be wrapped or type might vary
  const subCategory = subCategoryDetails as any;

  const parentName =
    (subCategory?.parent as ICategory)?.name?.en ||
    (typeof subCategory?.parent === "string" ? subCategory?.parent : "N/A");

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="SubCategory Details"
        description="View subcategory information"
        backRoute={ROUTES.SUBCATEGORIES.LIST}
        editRoute={
          subCategory?._id
            ? ROUTES.SUBCATEGORIES.EDIT(subCategory?._id)
            : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 h-fit">
          {isLoading ? (
            <CommonLoader fullScreen={false} />
          ) : isError || !subCategory ? (
            <CommonError onRetry={refetch} />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {subCategory?.name?.en}
                </h2>
                <Badge
                  variant={subCategory?.isActive ? "default" : "secondary"}
                  className="px-3 py-1 text-sm font-medium">
                  {subCategory?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <TranslationDisplay
                title="Global Translations"
                fields={SUBCATEGORY_FIELDS}
                values={{
                  name: subCategory?.name,
                  description: subCategory?.description,
                }}
              />
            </div>
          )}
        </Card>

        <Card className="p-6 h-fit bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Hierarchy Info
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                Parent Category
              </p>
              <p className="font-semibold text-primary">{parentName}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
