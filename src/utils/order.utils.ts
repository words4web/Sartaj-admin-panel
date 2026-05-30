import { Order, OrderStatus, PaymentStatus } from "@/types/order/order.types";

/**
 * Formats a status string (e.g., "payment_pending" -> "Payment Pending")
 * Uses optional chaining and Title Case conversion.
 */
export const formatStatus = (status?: string) =>
  (status || "")?.replace(/_/g, " ")?.replace(/\b\w/g, (c) => c?.toUpperCase());

export const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date?.getTime())) return "—";
  return date?.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Dynamic mapping for Order Status Badge variants
 */
const STATUS_VARIANT_MAP: Record<
  string,
  "success" | "destructive" | "outline" | "secondary"
> = {
  delivered: "success",
  cancelled: "destructive",
  payment_pending: "outline",
  placed: "secondary",
  processing: "secondary",
  dispatched: "secondary",
};

export const statusVariant = (status?: OrderStatus) =>
  STATUS_VARIANT_MAP[status || ""] || "secondary";

/**
 * Dynamic mapping for Payment Status Badge variants
 */
const PAYMENT_VARIANT_MAP: Record<
  string,
  "success" | "destructive" | "outline" | "secondary"
> = {
  paid: "success",
  failed: "destructive",
  refunded: "destructive",
  pending: "outline",
  unpaid: "outline",
};

export const paymentStatusVariant = (status?: string) =>
  PAYMENT_VARIANT_MAP[status || ""] || "secondary";

/**
 * Dynamic mapping for Payment Method labels
 */
export const PAYMENT_METHOD_MAP: Record<
  string,
  { label: string; icon?: string }
> = {
  daibiki: { label: "Cash on Delivery" },
  paypal: { label: "PayPal" },
  paypay: { label: "PayPay" },
};

export const formatPaymentMethod = (method?: string) =>
  PAYMENT_METHOD_MAP[method || ""]?.label || method || "—";

export const ORDER_STATUS_OPTIONS = [
  { label: "Payment Pending", value: "payment_pending" },
  { label: "Placed", value: "placed" },
  { label: "Processing", value: "processing" },
  { label: "Dispatched", value: "dispatched" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export const resolveCustomerName = (order?: Partial<Order>) => {
  if (!order) return "Customer";
  const customer = typeof order?.customer === "string" ? null : order?.customer;

  return customer?.fullName || "Customer";
};
