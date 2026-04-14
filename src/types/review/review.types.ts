export interface IReview {
  _id: string;
  rating: number;
  reviewText: string;
  isActive: boolean;
  createdAt: string;
  customer: {
    _id: string;
    name: string;
    phone?: string;
  };
}

export interface IReviewProduct {
  _id: string;
  name: string;
  image: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewListResponse {
  reviews: IReview[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
  product: IReviewProduct | null;
}

export interface ReviewListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
}
