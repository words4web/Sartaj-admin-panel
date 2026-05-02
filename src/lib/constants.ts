// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: "sartaj_theme",
  AUTH_STORE: "sartaj_auth_store",
  UI_STORE: "sartaj_ui_store",
  DEVICE_STORE: "sartaj_device_store",
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
} as const;

// Sort Options
export const SORT_OPTIONS = {
  NAME: "name",
  CREATED_AT: "createdAt",
  EMAIL: "email",
} as const;

export const SUPER_CATEGORIES = {
  WHOLESALER: "Wholesaler",
  RESTAURANT: "Restaurant",
  RETAILER: "Retailer",
} as const;

// Custom Window Events
export const CUSTOM_EVENTS = {
  AUTH_LOGOUT: "auth:logout",
  AUTH_REFRESH: "auth:refresh",
} as const;

// Notification Permission Statuses
export const NOTIFICATION_STATUS = {
  GRANTED: "granted",
  DENIED: "denied",
  DEFAULT: "default",
} as const;

// FCM Event Types (Synced with Backend)
export const FCM_EVENT_TYPES = {
  // Order Events (Admins need to know about these for live dashboard updates)
  NEW_ORDER: "NEW_ORDER",
  ORDER_PLACED: "ORDER_PLACED",
  ORDER_CONFIRMED: "ORDER_CONFIRMED",
  ORDER_PROCESSING: "ORDER_PROCESSING",
  ORDER_SHIPPED: "ORDER_SHIPPED",
  ORDER_DELIVERED: "ORDER_DELIVERED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  ORDER_CANCELLED_ADMIN: "ORDER_CANCELLED_ADMIN",
} as const;
