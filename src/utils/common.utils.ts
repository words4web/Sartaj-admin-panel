import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format amounts as Japanese yen
export function formatYen(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return `¥${amount?.toLocaleString("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
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
