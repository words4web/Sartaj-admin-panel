import { TranslationField } from "@/components/common/TranslationInput";

export const PRODUCT_BADGES = {
  FEATURED: "featured",
  HOT: "hot",
  NEW_ARRIVAL: "new_arrival",
} as const;

export type ProductBadge = (typeof PRODUCT_BADGES)[keyof typeof PRODUCT_BADGES];

export const PRODUCT_UNIT = {
  LITER: "liter",
  GRAM: "gram",
  KG: "kg",
  PIECE: "piece",
} as const;
export type ProductUnit = (typeof PRODUCT_UNIT)[keyof typeof PRODUCT_UNIT];

export const PRODUCT_TYPE = {
  DRY: "DRY",
  FROZEN: "FROZEN",
} as const;
export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

export const SELLING_UNIT = {
  CASE: "case",
  UNIT: "unit",
} as const;
export type SellingUnit = (typeof SELLING_UNIT)[keyof typeof SELLING_UNIT];

export const STOCK_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
} as const;
export type StockStatus = (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];

export const PRODUCT_TAG = {
  VEG: "veg",
  HALAL: "halal",
} as const;
export type ProductTag = (typeof PRODUCT_TAG)[keyof typeof PRODUCT_TAG];

export const PRODUCT_BADGE_OPTIONS: {
  key: ProductBadge;
  label: string;
}[] = [
  { key: PRODUCT_BADGES.FEATURED, label: "Featured" },
  { key: PRODUCT_BADGES.HOT, label: "Hot" },
  { key: PRODUCT_BADGES.NEW_ARRIVAL, label: "New arrival" },
];

export const PRODUCT_TAGS: { key: ProductTag; label: string }[] = [
  { key: PRODUCT_TAG.VEG, label: "Veg" },
  { key: PRODUCT_TAG.HALAL, label: "Halal" },
];

export const PRODUCT_UNITS: { key: ProductUnit; label: string }[] = [
  { key: PRODUCT_UNIT.LITER, label: "Liter" },
  { key: PRODUCT_UNIT.GRAM, label: "Gram" },
  { key: PRODUCT_UNIT.KG, label: "Kg" },
  { key: PRODUCT_UNIT.PIECE, label: "Piece" },
];

export const PRODUCT_TYPES: { key: ProductType; label: string }[] = [
  { key: PRODUCT_TYPE.DRY, label: "DRY" },
  { key: PRODUCT_TYPE.FROZEN, label: "FROZEN" },
];

export const SELLING_UNITS: { key: SellingUnit; label: string }[] = [
  { key: SELLING_UNIT.UNIT, label: "Unit" },
  { key: SELLING_UNIT.CASE, label: "Case" },
];

export const STOCK_STATUSES: { key: StockStatus; label: string }[] = [
  { key: STOCK_STATUS.IN_STOCK, label: "In stock" },
  { key: STOCK_STATUS.OUT_OF_STOCK, label: "Out of stock" },
];

export const PRODUCT_FORM_STEPS = [
  { id: "basic", label: "Basic Info" },
  { id: "pricing", label: "Pricing & Catalog" },
  { id: "packaging", label: "Packaging & Stock" },
] as const;

export const PRODUCT_FORM_VALIDATION_HINTS: Record<number, string> = {
  0: "Fill in all language names, descriptions, item code and upload an image.",
  1: "Select at least one segment with a price > 0, a category and a manufacturer.",
  2: "Fill in all packaging and inventory fields.",
};

export const PRODUCT_BASIC_INFO_FIELDS: TranslationField[] = [
  {
    key: "name",
    label: "Product name",
    required: true,
    placeholder: "Short product title",
  },
  {
    key: "description",
    label: "Description",
    required: true,
    multiline: true,
    rows: 3,
    resizeVertical: true,
    placeholder: "Full description for catalogs",
  },
];
