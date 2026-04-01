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
    TOGGLE_STATUS: (id: string) =>
      `${API_ADMIN_BASE}/customer/toggle-status/${id}`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/customer/delete-customer/${id}`,
  },

  // Super Categories
  SUPER_CATEGORIES: {
    LIST: `${API_ADMIN_BASE}/system/super-categories`,
  },

  // Categories
  CATEGORIES: {
    LIST: `${API_ADMIN_BASE}/category`,
    CREATE: `${API_ADMIN_BASE}/category/create`,
    DETAIL: (id: string) => `${API_ADMIN_BASE}/category/${id}`,
    SUBCATEGORIES: (id: string) =>
      `${API_ADMIN_BASE}/category/${id}/subcategories`,
    UPDATE: (id: string) => `${API_ADMIN_BASE}/category/${id}`,
    TOGGLE_STATUS: (id: string) => `${API_ADMIN_BASE}/category/${id}/status`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/category/${id}`,
  },

  // SubCategories
  SUBCATEGORIES: {
    LIST: `${API_ADMIN_BASE}/subcategory`,
    CREATE: `${API_ADMIN_BASE}/subcategory/create`,
    DETAIL: (id: string) => `${API_ADMIN_BASE}/subcategory/${id}`,
    UPDATE: (id: string) => `${API_ADMIN_BASE}/subcategory/${id}`,
    TOGGLE_STATUS: (id: string) => `${API_ADMIN_BASE}/subcategory/${id}/status`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/subcategory/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: `${API_ADMIN_BASE}/orders`,
    CREATE: `${API_ADMIN_BASE}/orders`,
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

  // Banners
  BANNERS: {
    LIST: `${API_ADMIN_BASE}/banner`,
    CREATE: `${API_ADMIN_BASE}/banner/create`,
    DETAIL: (id: string) => `${API_ADMIN_BASE}/banner/${id}`,
    UPDATE: (id: string) => `${API_ADMIN_BASE}/banner/${id}`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/banner/${id}`,
    TOGGLE_STATUS: (id: string) => `${API_ADMIN_BASE}/banner/${id}/status`,
  },

  // Manufacturers
  MANUFACTURERS: {
    LIST: `${API_ADMIN_BASE}/manufacturer`,
    CREATE: `${API_ADMIN_BASE}/manufacturer/create`,
    DETAIL: (id: string) => `${API_ADMIN_BASE}/manufacturer/${id}`,
    UPDATE: (id: string) => `${API_ADMIN_BASE}/manufacturer/${id}`,
    DELETE: (id: string) => `${API_ADMIN_BASE}/manufacturer/${id}`,
  },

  // Settings
  SETTINGS: {
    PROFILE: `${API_ADMIN_BASE}/settings/profile`,
    UPDATE_PROFILE: `${API_ADMIN_BASE}/settings/profile`,
    CHANGE_PASSWORD: `${API_ADMIN_BASE}/settings/password`,
  },
} as const;
