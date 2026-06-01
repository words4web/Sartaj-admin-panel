// Frontend Navigation Routes
export const ROUTES = {
  // Public routes
  LOGIN: "/login",

  // Dashboard routes
  DASHBOARD: "/dashboard",

  CUSTOMERS: {
    LIST: "/dashboard/customers",
    DETAIL: (id: string) => `/dashboard/customers/${id}`,
    EDIT: (id: string) => `/dashboard/customers/${id}/edit`,
    NEW: "/dashboard/customers/new",
    WALLET: (id: string) => `/dashboard/customers/${id}/wallet`,
  },
  CATEGORIES: {
    LIST: "/dashboard/categories",
    DETAIL: (id: string) => `/dashboard/categories/${id}`,
    EDIT: (id: string) => `/dashboard/categories/${id}/edit`,
    NEW: "/dashboard/categories/new",
  },
  BANNERS: {
    LIST: "/dashboard/banners",
    DETAIL: (id: string) => `/dashboard/banners/${id}`,
    EDIT: (id: string) => `/dashboard/banners/${id}/edit`,
    NEW: "/dashboard/banners/new",
  },
  MANUFACTURERS: {
    LIST: "/dashboard/manufacturers",
    DETAIL: (id: string) => `/dashboard/manufacturers/${id}`,
    EDIT: (id: string) => `/dashboard/manufacturers/${id}/edit`,
    NEW: "/dashboard/manufacturers/new",
  },
  COUPONS: {
    LIST: "/dashboard/coupons",
    DETAIL: (id: string) => `/dashboard/coupons/${id}`,
    EDIT: (id: string) => `/dashboard/coupons/${id}/edit`,
    NEW: "/dashboard/coupons/new",
  },
  PRICE_LISTS: {
    LIST: "/dashboard/price-lists",
    EDIT: (id: string) => `/dashboard/price-lists/${id}/edit`,
    NEW: "/dashboard/price-lists/new",
  },
  SUBCATEGORIES: {
    LIST: "/dashboard/subcategories",
    DETAIL: (id: string) => `/dashboard/subcategories/${id}`,
    EDIT: (id: string) => `/dashboard/subcategories/${id}/edit`,
    NEW: "/dashboard/subcategories/new",
  },
  CMS: {
    LIST: "/dashboard/cms",
    DETAIL: (id: string) => `/dashboard/cms/${id}`,
    EDIT: (id: string) => `/dashboard/cms/${id}/edit`,
    NEW: "/dashboard/cms/new",
  },

  SETTINGS: {
    ROOT: "/dashboard/settings",
    PROFILE: "/dashboard/settings/profile",
  },

  // Future module routes
  ORDERS: {
    LIST: "/dashboard/orders",
    DETAIL: (id: string) => `/dashboard/orders/${id}`,
  },
  PRODUCTS: {
    LIST: "/dashboard/products",
    NEW: "/dashboard/products/new",
    DETAIL: (id: string) => `/dashboard/products/${id}`,
    EDIT: (id: string) => `/dashboard/products/${id}/edit`,
    REVIEWS: (id: string) => `/dashboard/products/${id}/review`,
  },
  ANALYTICS: {
    ROOT: "/dashboard/analytics",
  },
  ORDER_CONFIG: "/dashboard/order-config",
  NOTIFICATIONS: "/dashboard/notifications",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
