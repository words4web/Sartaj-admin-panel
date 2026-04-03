export enum ECouponType {
  DEFAULT = "Default",
  FIRST_ORDER = "First Order",
}

export enum EDiscountType {
  PERCENT = "Percent",
  AMOUNT = "Amount",
}

export interface ICoupon {
  _id: string;
  type: ECouponType;
  title: string;
  code: string;
  limitPerUser: number;
  discountType: EDiscountType;
  discountAmount: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  type?: ECouponType;
  title: string;
  code: string;
  limitPerUser?: number;
  discountType: EDiscountType;
  discountAmount: number;
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
  type: ECouponType;
  title: string;
  code: string;
  limitPerUser: number;
  discountType: EDiscountType;
  discountAmount: number;
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
