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
  SUBCATEGORIES: {
    LIST: "/dashboard/subcategories",
    DETAIL: (id: string) => `/dashboard/subcategories/${id}`,
    EDIT: (id: string) => `/dashboard/subcategories/${id}/edit`,
    NEW: "/dashboard/subcategories/new",
  },

  SETTINGS: {
    ROOT: "/dashboard/settings",
    PROFILE: "/dashboard/settings/profile",
  },

  // Future module routes
  ORDERS: {
    LIST: "/dashboard/orders",
  },
  PRODUCTS: {
    LIST: "/dashboard/products",
  },
  ANALYTICS: {
    ROOT: "/dashboard/analytics",
  },
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
