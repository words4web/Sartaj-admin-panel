// Frontend Navigation Routes
export const ROUTES = {
  // Public routes
  LOGIN: "/login",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  CUSTOMERS: "/dashboard/customers",
  CUSTOMER_DETAIL: (id: string) => `/dashboard/customers/${id}`,
  SETTINGS: "/dashboard/settings",
  SETTINGS_PROFILE: "/dashboard/settings/profile",

  // Future module routes
  ORDERS: "/dashboard/orders",
  PRODUCTS: "/dashboard/products",
  ANALYTICS: "/dashboard/analytics",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
