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
