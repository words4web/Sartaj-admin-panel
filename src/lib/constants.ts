// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "sartaj_auth_token",
  USER_DATA: "sartaj_user_data",
  THEME: "sartaj_theme",
  AUTH_STORE: "sartaj_auth_store",
  UI_STORE: "sartaj_ui_store",
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
} as const;

// Customer Status
export const CUSTOMER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

// Sort Options
export const SORT_OPTIONS = {
  NAME: "name",
  CREATED_AT: "createdAt",
  EMAIL: "email",
} as const;
