"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import {
  useCategoryById,
  useSubcategoriesByCategory,
} from "@/services/category/category.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { TranslationDisplay } from "@/components/common/TranslationDisplay";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

const CATEGORY_TRANSLATION_FIELDS = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];

export default function CategoryDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    refetch: refetchCategories,
  } = useCategoryById(id);

  const {
    data: subcategories,
    isLoading: isSubcategoriesLoading,
    isError: isSubcategoriesError,
    refetch: refetchSubCategories,
  } = useSubcategoriesByCategory(id);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Category Details"
        description="View category information"
        backRoute={ROUTES.CATEGORIES.LIST}
        editRoute={
          category?._id ? ROUTES.CATEGORIES.EDIT(category?._id) : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="lg:col-span-2 p-6 h-fit">
          {isCategoryLoading ? (
            <CommonLoader fullScreen={false} />
          ) : isCategoryError || !category ? (
            <CommonError
              message="Failed to load category details. Please check your connection."
              onRetry={refetchCategories}
            />
          ) : (
            <div className="space-y-6">
              {/* Title + status */}
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {category?.name?.en}
                </h2>
                <Badge
                  variant={category?.isActive ? "default" : "secondary"}
                  className="px-3 py-1 text-sm font-medium"
                >
                  {category?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Translations */}
              <TranslationDisplay
                title="Global Translations"
                fields={CATEGORY_TRANSLATION_FIELDS}
                values={{
                  name: category?.name,
                  description: category?.description,
                }}
              />
            </div>
          )}
        </Card>

        {/* Image Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Image</h3>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 p-2">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              {category?.image ? (
                <Image
                  src={category.image}
                  alt={category?.name?.en || "category image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/400x400/e2e8f0/64748b?text=Broken+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                  <span className="text-xs font-medium">No Image Uploaded</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Subcategories */}
      <Card className="p-6">
        {isSubcategoriesLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isSubcategoriesError || !subcategories ? (
          <CommonError
            message="Failed to load subcategory details. Please check your connection."
            onRetry={refetchSubCategories}
          />
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Registered Subcategories
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Manage lower-level categories linked to this parent.
                </p>
              </div>
              <Badge
                variant={subcategories?.length > 0 ? "default" : "secondary"}
                className="px-4 py-1"
              >
                {subcategories?.length} total
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {subcategories?.map((s) => (
                <div
                  key={s?._id}
                  className="group flex flex-col gap-3 p-4 border border-gray-100 rounded-xl bg-white hover:border-primary/20 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {s?.name?.en || "Unnamed Subcategory"}
                    </p>
                    <Badge
                      variant={s?.isActive ? "default" : "secondary"}
                      className="scale-90 shrink-0"
                    >
                      {s?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {s?.description?.en || "No description provided."}
                  </p>
                  {/* Language pills */}
                  <div className="pt-2 flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    {["HI", "NE", "JA", "BN"].map((code) => (
                      <span
                        key={code}
                        className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 uppercase"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {subcategories?.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-gray-400 font-medium">
                    No subcategories found for this category.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
