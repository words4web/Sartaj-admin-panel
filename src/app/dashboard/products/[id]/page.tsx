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
import { PRODUCT_BADGES } from "@/constants/product.constants";
import {
  localizedName,
  subcategoryDisplay,
  superCategoryLabel,
} from "@/utils/product.util";
import {
  PRODUCT_TAGS,
  PRODUCT_CASE_TYPE_OPTIONS,
} from "@/constants/product.constants";
import { TAX_CATEGORY, TAX_TYPE } from "@/services/appConfig/appConfig.service";
import { useAppConfig } from "@/services/appConfig/appConfig.hooks";

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
  const { data: config } = useAppConfig();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2 min-w-0 flex-1">
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

        {/* Single line corner scroll */}
        {product?.images?.length ? (
          <div className="shrink-0 flex flex-nowrap gap-2 max-w-[440px] overflow-x-auto pb-2">
            {product?.images?.slice(0, 3).map((src, i) => (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Product ${i + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/400?text=Error";
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Super category pricing
        </h3>
        {(product?.basePrices?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500">No base prices.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product?.basePrices?.map((bp, i) => {
              const sCLabel = superCategoryLabel(bp);
              return (
                <div
                  key={`${sCLabel}-${bp?.superCategoryId ?? "-"}-${i}`}
                  className="flex flex-col gap-1 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {sCLabel}
                  </span>
                  <span className="font-mono text-lg font-bold text-primary tabular-nums shrink-0">
                    {typeof bp?.price === "number" ? formatYen(bp?.price) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
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
            {product?.caseType && (
              <DetailRow label="Case type">
                {PRODUCT_CASE_TYPE_OPTIONS.find(
                  (o) => o.key === product?.caseType,
                )?.label ?? product.caseType}
              </DetailRow>
            )}
            <DetailRow label="Tags" className="col-span-2">
              {product?.tags?.length ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {product?.tags?.map((tagKey) => {
                    const label =
                      PRODUCT_TAGS.find((t) => t.key === tagKey)?.label ??
                      tagKey;
                    return (
                      <span
                        key={tagKey}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {label}
                      </span>
                    );
                  })}
                </div>
              ) : (
                "—"
              )}
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

          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider pt-4 border-t border-gray-100">
            Tax configuration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailRow label="Taxable">
              {product?.isTaxable ? "Yes" : "No"}
            </DetailRow>
            {product?.isTaxable && (
              <>
                <DetailRow label="Tax category">
                  <span className="">
                    {product?.taxConfig?.category ?? "—"}
                  </span>
                </DetailRow>
                <DetailRow label="Tax type">
                  <span className="capitalize">
                    {product?.taxConfig?.taxType ?? "—"}
                  </span>
                </DetailRow>
                <DetailRow label="Tax value">
                  {(() => {
                    const isDynamic =
                      (product?.taxConfig?.category === TAX_CATEGORY.REDUCED ||
                        product?.taxConfig?.category ===
                          TAX_CATEGORY.STANDARD) &&
                      product?.taxConfig?.taxType === TAX_TYPE.PERCENTAGE;

                    const displayValue = isDynamic
                      ? (config?.taxes?.find(
                          (t) => t?.category === product?.taxConfig?.category,
                        )?.value ??
                        product?.taxConfig?.taxValue ??
                        "0")
                      : (product?.taxConfig?.taxValue ?? "0");

                    return (
                      <>
                        {displayValue}
                        {product?.taxConfig?.taxType === TAX_TYPE.PERCENTAGE
                          ? "%"
                          : " ¥"}
                        {isDynamic && (
                          <span className="text-gray-400 text-xs ml-2">
                            (As per global settings)
                          </span>
                        )}
                      </>
                    );
                  })()}
                </DetailRow>
              </>
            )}
          </div>
        </div>
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
