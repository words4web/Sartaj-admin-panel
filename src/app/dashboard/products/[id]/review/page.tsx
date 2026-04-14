"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  useReviewList,
  useToggleReviewStatus,
} from "@/services/review/review.hooks";
import { IReview } from "@/types/review/review.types";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Pagination } from "@/components/common/Pagination";
import { DataTable, Column } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { CommonLoader } from "@/components/ui/common-loader";
import { CommonError } from "@/components/ui/common-error";
import { RatingGraph } from "@/components/review/RatingGraph";
import { Switch } from "@/components/ui/switch";
import { Loader2, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const ExpandableReview = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowButton = text?.length > 100; // Simplified check for "too long"

  return (
    <div className="flex flex-col gap-1 max-w-[400px]">
      <span
        className={`text-sm text-gray-700 whitespace-pre-wrap ${!isExpanded ? "line-clamp-2" : ""}`}
      >
        {text}
      </span>
      {shouldShowButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-xs font-semibold text-primary hover:underline w-fit"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default function ReviewPage() {
  const params = useParams();
  const productId = params?.id as string;
  const limit = 10;
  const [page, setPage] = useState(1);
  const [confirmStatusChange, setConfirmStatusChange] =
    useState<IReview | null>(null);

  const { data, isLoading, isError, refetch } = useReviewList(productId, {
    page,
    limit,
  });

  const toggleMutation = useToggleReviewStatus(productId);

  const handleConfirmStatusChange = useCallback(() => {
    if (!confirmStatusChange?._id) return;
    toggleMutation.mutate(confirmStatusChange._id, {
      onSettled: () => setConfirmStatusChange(null),
    });
  }, [confirmStatusChange, toggleMutation]);

  const columns: Column<IReview>[] = useMemo(
    () => [
      {
        key: "rating",
        label: "Rating",
        width: "120px",
        render: (_: unknown, row: IReview) => (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5]?.map((s) => (
              <Star
                key={s}
                size={14}
                className={
                  s <= row?.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
        ),
      },
      {
        key: "reviewText",
        label: "Review",
        render: (_: unknown, row: IReview) => (
          <ExpandableReview text={row?.reviewText} />
        ),
      },
      {
        key: "customer",
        label: "Customer",
        width: "200px",
        render: (_: unknown, row: IReview) => (
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-900 line-clamp-1">
              {row?.customer?.name ?? "Unknown"}
            </span>
            {row?.customer?.phone && (
              <span className="text-xs text-gray-500">
                {row?.customer?.phone}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "createdAt",
        label: "Added On",
        width: "150px",
        render: (_: unknown, row: IReview) => (
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">
              {row?.createdAt
                ? new Date(row?.createdAt).toLocaleDateString()
                : "-"}
            </span>
            <span className="text-xs text-gray-400">
              {row?.createdAt
                ? new Date(row?.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        ),
      },
      {
        key: "isActive",
        label: "Visibility",
        width: "100px",
        render: (_: unknown, row: IReview) => {
          const isToggling =
            toggleMutation.isPending && toggleMutation?.variables === row?._id;
          return (
            <div className="flex items-center gap-3">
              <Switch
                checked={row?.isActive}
                onCheckedChange={() => setConfirmStatusChange(row)}
                disabled={isToggling}
              />
              {isToggling && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
            </div>
          );
        },
      },
    ],
    [toggleMutation],
  );

  if (isLoading && page === 1) {
    return (
      <div className="p-4 h-[calc(100vh-100px)]">
        <CommonLoader fullScreen={false} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 h-[calc(100vh-100px)]">
        <CommonError onRetry={() => refetch()} />
      </div>
    );
  }

  const result = data?.data;
  const meta = data?.meta;
  const product = result?.product;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title={`Reviews`}
        description={product ? `Viewing reviews for ${product.name}` : ""}
        backRoute={ROUTES.PRODUCTS.LIST}
      />

      {/* Product & Rating Graph Container */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Product Card */}
        {product && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center justify-center shrink-0 w-full xl:w-[250px]">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product?.image || ""}
                alt={product?.name || "Product"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/128?text=No+Image";
                }}
              />
            </div>
            <h3
              className="font-semibold text-gray-900 text-center line-clamp-2"
              title={product?.name}
            >
              {product?.name}
            </h3>
          </div>
        )}

        {/* Rating Graph */}
        {result && (
          <div className="flex-1">
            <RatingGraph
              averageRating={result?.averageRating}
              totalReviews={result?.totalReviews}
              ratingDistribution={result?.ratingDistribution}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={result?.reviews ?? []}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing{" "}
            <span className="font-medium">{result?.reviews?.length || 0}</span>{" "}
            of <span className="font-medium">{meta?.total || 0}</span> reviews
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      )}

      <ConfirmModal
        open={!!confirmStatusChange}
        title={`${confirmStatusChange?.isActive ? "Hide" : "Show"} this review?`}
        description={
          confirmStatusChange?.isActive
            ? "When hidden, this review will no longer be visible to customers and will not count towards the product's average rating."
            : "When visible, this review will be shown to customers and will count towards the product's average rating."
        }
        confirmLabel={
          confirmStatusChange?.isActive ? "Hide Review" : "Show Review"
        }
        destructive={confirmStatusChange?.isActive}
        isLoading={toggleMutation.isPending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmStatusChange(null)}
      />
    </div>
  );
}
