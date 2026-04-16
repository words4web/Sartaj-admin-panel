export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface OrderCustomerSummary {
  _id: string;
  fullName?: string;
  mobileNumber?: string;
}

export interface OrderItem {
  product?: {
    _id?: string;
    name?: string | Record<string, string>;
    sku?: string;
  };
  productSnapshot?: {
    name?: string | Record<string, string>;
    sku?: string;
  };
  quantity: number;
  price: number;
  lineSubtotal?: number;
  lineDiscount?: number;
  lineTax?: number;
}

export interface OrderAddressSnapshot {
  fullName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  building?: string;
  phone: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customer: string | OrderCustomerSummary;
  items: OrderItem[];
  subTotal: number;
  couponDiscount?: number;
  taxAmount?: number;
  shippingFee: number;
  totalAmount: number;
  notes?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress?: OrderAddressSnapshot;
  createdAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export interface UpdateOrderStatusPayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}
