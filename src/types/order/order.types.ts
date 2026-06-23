import { IAddress } from "../customer/customer.types";

export enum OrderStatusEnum {
  PAYMENT_PENDING = "payment_pending",
  PLACED = "placed",
  PROCESSING = "processing",
  DISPATCHED = "dispatched",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export type OrderStatus =
  | "payment_pending"
  | "placed"
  | "processing"
  | "dispatched"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "unpaid"
  | "paid"
  | "failed"
  | "refunded";

export type PaymentMethod = "daibiki" | "paypal" | "paypay";

export type OrderTab = "active" | "completed" | "cancelled";

export interface OrderCustomerSummary {
  _id: string;
  fullName: string;
  mobileNumber: string;
  addresses: IAddress[];
}

export enum PriceBreakdownType {
  SUBTOTAL = "SUBTOTAL",
  TAX = "TAX",
  WALLET = "WALLET",
  SHIPPING = "SHIPPING",
  DISCOUNT = "DISCOUNT",
  COUPON = "COUPON",
  PENALTY = "PENALTY",
  SURCHARGE = "SURCHARGE",
  OTHER = "OTHER",
  TOTAL = "TOTAL",
}

export interface IPriceBreakdownItem {
  name: string;
  amount: number;
  type: PriceBreakdownType;
  isNegative?: boolean;
}

export interface IOrderCalculationSnapshot {
  taxTotal: number;
  couponDiscount: number;
  shippingFee: number;
  subTotal: number;
  penaltyAmount: number;
  otherCharges: number;
  totalAmount: number;
}

export interface OrderItem {
  product?: {
    _id?: string;
    name?: string;
    sku?: string;
    images?: string[];
  };
  productSnapshot?: {
    productId: string;
    sku: string;
    name: string;
    images?: string[];
    productType: string;
    unit: string;
    basePrice: number;
    discountedBasePrice: number;
    customerPrice?: number;
    priceSource: string;
    netWeightKg?: number;
  };
  quantity: number;
  price: number;
  lineSubtotal: number;
  lineDiscount: number;
  lineTax: number;
  taxRate: number;
}

export interface OrderAddressSnapshot {
  addressId: string;
  fullName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  building: string;
  phone: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customer: OrderCustomerSummary;
  items: OrderItem[];
  priceBreakdown: IPriceBreakdownItem[];
  calculationSnapshot: IOrderCalculationSnapshot;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: OrderAddressSnapshot;
  coupon?: {
    code: string;
  };
  trackOrder?: string;
  invoiceURL?: string;
  deliveryDate?: string | null;
  deliverySlot?: string | null;
  deliveryTerms?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderTrackingPayload {
  trackOrder: string;
}

export interface OrderListResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  orderTab?: OrderTab;
}

export interface UpdateOrderStatusPayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

// ─── Component Props

export interface OrderStatusUpdaterProps {
  order: Order;
  status: OrderStatus | "";
  paymentStatus: PaymentStatus | "";
  initialStatus: OrderStatus | "";
  onStatusChange: (value: OrderStatus) => void;
  onUpdate: (data: UpdateOrderStatusPayload) => void;
  isUpdating: boolean;
  disabled?: boolean;
}

export interface OrderItemsListProps {
  items?: OrderItem[];
}

export interface CustomerInfoCardProps {
  order?: Order;
}

export interface PaymentBreakdownCardProps {
  order?: Order;
}

export interface OrderNotesCardProps {
  notes?: string;
}
