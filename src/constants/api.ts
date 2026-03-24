// Backend API Routes
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Customers
  CUSTOMERS: {
    LIST: `${API_BASE_URL}/customers`,
    CREATE: `${API_BASE_URL}/customers`,
    DETAIL: (id: string) => `${API_BASE_URL}/customers/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/customers/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/customers/${id}`,
    SEARCH: `${API_BASE_URL}/customers/search`,
  },

  // Orders
  ORDERS: {
    LIST: `${API_BASE_URL}/orders`,
    CREATE: `${API_BASE_URL}/orders`,
    DETAIL: (id: string) => `${API_BASE_URL}/orders/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/orders/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/orders/${id}`,
  },

  // Products
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    CREATE: `${API_BASE_URL}/products`,
    DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/products/${id}`,
  },

  // Settings
  SETTINGS: {
    PROFILE: `${API_BASE_URL}/settings/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/settings/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/settings/password`,
  },
} as const;
