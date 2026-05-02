import { create } from "zustand";
import { CustomerFilters } from "@/types/customer/customer.types";
import { PAGINATION, SORT_OPTIONS } from "@/lib/constants";

interface CustomerStore extends CustomerFilters {
  setSearch: (search: string) => void;
  setIsActive: (isActive: boolean | undefined) => void;
  setSortBy: (sortBy: "name" | "createdAt" | "email") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  search: "",
  isActive: undefined,
  sortBy: SORT_OPTIONS.NAME,
  sortOrder: "asc",
  page: PAGINATION.DEFAULT_PAGE,
  limit: PAGINATION.DEFAULT_LIMIT,

  setSearch: (search) => set({ search, page: PAGINATION.DEFAULT_PAGE }),

  setIsActive: (isActive) => set({ isActive, page: PAGINATION.DEFAULT_PAGE }),

  setSortBy: (sortBy) => set({ sortBy }),

  setSortOrder: (sortOrder) => set({ sortOrder }),

  setPage: (page) => set({ page }),

  setLimit: (limit) => set({ limit, page: PAGINATION.DEFAULT_PAGE }),

  resetFilters: () =>
    set({
      search: "",
      isActive: undefined,
      sortBy: SORT_OPTIONS.NAME,
      sortOrder: "asc",
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
    }),
}));
