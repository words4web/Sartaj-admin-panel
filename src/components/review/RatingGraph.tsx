"use client";

import { Star } from "lucide-react";
import { RatingDistribution } from "@/types/review/review.types";

interface RatingGraphProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export function RatingGraph({
  averageRating,
  totalReviews,
  ratingDistribution,
}: RatingGraphProps) {
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 bg-white rounded-xl border border-gray-200">
      {/* Average Score */}
      <div className="flex flex-col items-center justify-center min-w-[100px] text-center shrink-0">
        <span className="text-5xl font-bold text-gray-900 leading-none">
          {averageRating.toFixed(1)}
        </span>
        <div className="flex items-center gap-0.5 mt-2">
          {[1, 2, 3, 4, 5]?.map((s) => (
            <Star
              key={s}
              size={14}
              className={
                s <= Math.round(averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">{totalReviews} reviews</p>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-16 bg-gray-200 shrink-0" />

      {/* Distribution bars */}
      <div className="flex-1 w-full space-y-1.5">
        {stars.map((star) => {
          const count = ratingDistribution[star] ?? 0;
          const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 w-8 shrink-0 text-gray-600 text-xs font-medium">
                {star}
                <Star size={10} className="fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-gray-500 shrink-0">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
