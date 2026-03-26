const API_ADMIN_BASE = "admin";

export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: `${API_ADMIN_BASE}/auth/login`,
    LOGOUT: `${API_ADMIN_BASE}/auth/logout`,
    REFRESH: `${API_ADMIN_BASE}/auth/refresh-token`,
    PROFILE: `${API_ADMIN_BASE}/auth/profile`,
  },

  // Customers
  CUSTOMERS: {
    LIST: `${API_ADMIN_BASE}/customer/get-all-customers`,
    CREATE: `${API_ADMIN_BASE}/customer/create-customer`,
    DETAIL: (id: string) => `${API_ADMIN_BASE}/customer/get-customer/${id}`,
    UPDATE: (id: string) => `${API_ADMIN_BASE}/customer/update-customer/${id}`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/customer/delete-customer/${id}`,
    SEARCH: `${API_ADMIN_BASE}/customer/search`,
  },

  // Orders
  ORDERS: {
    LIST: `${API_ADMIN_BASE}/orders`,
    CREATE: `${API_ADMIN_BASE}/orders`, // Reserved for potential future use
    DETAIL: (id: string) => `${API_ADMIN_BASE}/orders/${id}`,
    UPDATE: (id: string) => `${API_ADMIN_BASE}/orders/${id}`,
    UPDATE_STATUS: (id: string) => `${API_ADMIN_BASE}/orders/${id}/status`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/orders/${id}`,
  },

  // Products
  PRODUCTS: {
    LIST: `${API_ADMIN_BASE}/product`,
    CREATE: `${API_ADMIN_BASE}/product/create`,
    DETAIL: (id: string) => `${API_ADMIN_BASE}/product/${id}`,
    UPDATE: (id: string) => `${API_ADMIN_BASE}/product/${id}`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/product/${id}`,
  },

  // Settings
  SETTINGS: {
    PROFILE: `${API_ADMIN_BASE}/settings/profile`,
    UPDATE_PROFILE: `${API_ADMIN_BASE}/settings/profile`,
    CHANGE_PASSWORD: `${API_ADMIN_BASE}/settings/password`,
  },
} as const;
