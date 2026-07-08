export interface PriceBreakdownMetric {
  label: string;
  key: string;
  negative?: boolean;
}

export const PRICE_BREAKDOWN_METRICS: PriceBreakdownMetric[] = [
  { label: "Subtotal", key: "subTotal" },
  { label: "Coupon Discount", key: "couponDiscount", negative: true },
  { label: "Wallet Debit", key: "walletDebit", negative: true },
  { label: "Shipping Fee", key: "shippingFee" },
  { label: "Regional Surcharge", key: "otherCharges" },
  { label: "Minimum Order Penalty", key: "penaltyAmount" },
  { label: "Tax", key: "taxTotal" },
];
