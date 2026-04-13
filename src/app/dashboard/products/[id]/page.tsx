"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { useProduct } from "@/services/product/product.hooks";
import { ROUTES } from "@/constants/routes";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { TranslationDisplay } from "@/components/common/TranslationDisplay";
import { dateUtils, formatYen } from "@/utils/common.utils";
import type { IProduct } from "@/types/product/product.types";
import type { ITranslationMap } from "@/types/api.types";
import { PRODUCT_BADGES } from "@/constants/product.constants";
import {
  localizedName,
  subcategoryDisplay,
  superCategoryLabel,
} from "@/utils/product.util";

function DetailRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-800">{children}</div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: product, isLoading, isError, refetch } = useProduct(id);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Product details"
        description="Read-only catalog information"
        backRoute={ROUTES.PRODUCTS.LIST}
        editRoute={
          product?._id ? ROUTES.PRODUCTS.EDIT(product?._id) : undefined
        }
      />

      <Card className="p-6">
        {isLoading ? (
          <CommonLoader fullScreen={false} />
        ) : isError || !product ? (
          <CommonError
            message="Failed to load product."
            onRetry={() => refetch()}
          />
        ) : (
          <ProductDetailContent product={product} />
        )}
      </Card>
    </div>
  );
}

function ProductDetailContent({ product }: { product: IProduct }) {
  const title = product?.name?.en ?? product?.sku ?? "Product";
  const tags = product?.tags?.length ? product?.tags?.join(", ") : "—";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="space-y-2 min-w-0">
          <p className="font-mono text-sm text-gray-500">{product?.sku}</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 wrap-break-word hyphens-auto">
            {title}
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {product?.isActive === false ? (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                Inactive
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                Active
              </span>
            )}
            {product?.badges?.includes(PRODUCT_BADGES.FEATURED) ? (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                Featured
              </span>
            ) : null}
            {product?.badges?.includes(PRODUCT_BADGES.HOT) ? (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                Hot
              </span>
            ) : null}
            {product?.badges?.includes(PRODUCT_BADGES.NEW_ARRIVAL) ? (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                New
              </span>
            ) : null}
            {product?.restrictions?.age20Plus ? (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                20+
              </span>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-56 space-y-2">
          <div className="aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product?.images?.[0]}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400?text=No+image";
              }}
            />
          </div>
          {(product?.images?.length ?? 0) > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product?.images?.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`Product image ${i + 1}`}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/56?text=?";
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TranslationDisplay
          title="Other languages"
          fields={[
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
          ]}
          values={{
            name: product?.name,
            description: product?.description,
          }}
          longContentKeys={["name", "description"]}
        />

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Catalog
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Category">
              {localizedName(product?.category)}
            </DetailRow>
            <DetailRow label="Subcategory">
              {subcategoryDisplay(product)}
            </DetailRow>
            <DetailRow label="Manufacturer" className="sm:col-span-2">
              {localizedName(product?.manufacturer)}
            </DetailRow>
          </div>

          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider pt-4 border-t border-gray-100">
            Packaging & type
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailRow label="Unit">{product?.unit ?? "—"}</DetailRow>
            <DetailRow label="Net weight (kg)">
              {product?.netWeightKg ?? "—"}
            </DetailRow>
            <DetailRow label="Case quantity">
              {product?.caseQuantity ?? "—"}
            </DetailRow>
            <DetailRow label="Product type">
              {product?.productType ?? "—"}
            </DetailRow>
            <DetailRow label="Tags" className="col-span-2">
              {tags}
            </DetailRow>
          </div>

          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider pt-4 border-t border-gray-100">
            Inventory
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <DetailRow label="Stock quantity">
              {product?.stockQuantity ?? "—"}
            </DetailRow>
            <DetailRow label="Selling unit">
              {product?.sellingUnit ?? "—"}
            </DetailRow>
            <DetailRow label="Stock status">
              <span className="capitalize">{product?.stockStatus ?? "—"}</span>
            </DetailRow>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Super category pricing
        </h3>
        {(product?.basePrices?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500">No base prices.</p>
        ) : (
          <div className="rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {product?.basePrices?.map((bp, i) => {
              const sCLabel = superCategoryLabel(bp);
              return (
                <div
                  key={`${sCLabel}-${bp?.superCategoryId ?? "-"}-${i}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 bg-white">
                  <span className="text-sm font-medium text-gray-900 min-w-0 wrap-break-word pr-2">
                    {sCLabel}
                  </span>
                  <span className="font-mono text-sm text-gray-700 tabular-nums shrink-0">
                    {typeof bp?.price === "number" ? formatYen(bp?.price) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <DetailRow label="Created">
          {product?.createdAt ? dateUtils?.format(product.createdAt) : "—"}
        </DetailRow>
        <DetailRow label="Last updated">
          {product?.updatedAt ? dateUtils?.format(product.updatedAt) : "—"}
        </DetailRow>
      </div>
    </div>
  );
}
