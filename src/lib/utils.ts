import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const dateUtils = {
  format: (date: string | Date, format = "MMM DD, YYYY") => {
    return dayjs(date).format(format);
  },
  formatTime: (date: string | Date, format = "HH:mm A") => {
    return dayjs(date).format(format);
  },
  formatDateTime: (date: string | Date, format = "MMM DD, YYYY HH:mm A") => {
    return dayjs(date).format(format);
  },
  isToday: (date: string | Date) => {
    return dayjs(date).isSame(dayjs(), "day");
  },
  isYesterday: (date: string | Date) => {
    return dayjs(date).isSame(dayjs().subtract(1, "day"), "day");
  },
  daysFromNow: (date: string | Date) => {
    return dayjs(date).diff(dayjs(), "day");
  },
};

// Error handling
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

// Local storage utilities
export const storageUtils = {
  get: (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },
  clear: () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9\-\+\(\)\s]*$/;
  return phoneRegex.test(phone);
};
