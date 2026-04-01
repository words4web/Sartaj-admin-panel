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

      <Card className="p-6">
        {isCategoryLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isCategoryError || !category ? (
          <CommonError
            message="Failed to load category details. Please check your connection."
            onRetry={refetchCategories}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-gray-700">{category.description || "—"}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(category.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

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
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Subcategories</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Child categories under this category
                </p>
              </div>
              <Badge
                variant={subcategories?.length > 0 ? "default" : "secondary"}>
                {subcategories?.length} total
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              {subcategories?.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between gap-4 p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{s?.name}</p>
                    <p className="text-sm text-gray-500">
                      {s?.description || "—"}
                    </p>
                  </div>
                  <Badge variant={s?.isActive ? "default" : "secondary"}>
                    {s?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
