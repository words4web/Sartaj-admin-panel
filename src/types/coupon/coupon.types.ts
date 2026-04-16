import { ITranslationMap } from "@/types/api.types";

export enum ECouponVisibility {
  PUBLIC = "Public",
  PRIVATE = "Private",
}

export enum EDiscountType {
  PERCENT = "Percent",
  AMOUNT = "Amount",
}

export interface ICoupon {
  _id: string;
  visibility: ECouponVisibility;
  superCategory: string | { _id: string; [key: string]: any };
  title: ITranslationMap;
  code: string;
  discountType: EDiscountType;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  isDeleted: boolean;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  visibility?: ECouponVisibility;
  superCategory: string;
  title: ITranslationMap;
  code: string;
  discountType: EDiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  isActive?: boolean;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {}

export interface CouponListResponse {
  coupons: ICoupon[];
  total: number;
  page: number;
  limit: number;
}

export interface CouponFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export type CouponFormValues = {
  visibility: ECouponVisibility;
  superCategory: string;
  title: ITranslationMap;
  code: string;
  discountType: EDiscountType;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
};

export type CouponFormProps = {
  initialValues: CouponFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: CouponFormValues) => void | Promise<void>;
};
