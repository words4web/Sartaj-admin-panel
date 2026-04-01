import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "./category.api";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryFilters,
} from "@/types/category/category.types";
import { toast } from "sonner";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters?: CategoryFilters) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  subcategories: (parentId: string) =>
    [...categoryKeys.all, "subcategories", parentId] as const,
};

export const useCategoryList = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryApi.getCategories(filters),
  });
};

export const useCategoryById = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
  });
};

export const useSubcategoriesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: categoryKeys.subcategories(categoryId),
    queryFn: () => categoryApi.getSubcategoriesByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryPayload) =>
      categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create category");
    },
  });
};

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryPayload) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update category");
    },
  });
};

export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      categoryApi.toggleStatus(id, isActive),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success(
        `Category ${isActive ? "activated" : "deactivated"} successfully`,
      );
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update status");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete category");
    },
  });
};
