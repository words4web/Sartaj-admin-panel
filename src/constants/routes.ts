// Frontend Navigation Routes
export const ROUTES = {
  // Public routes
  LOGIN: "/login",

  // Dashboard routes
  DASHBOARD: "/dashboard",

  CUSTOMERS: {
    LIST: "/dashboard/customers",
    DETAIL: (id: string) => `/dashboard/customers/${id}`,
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
