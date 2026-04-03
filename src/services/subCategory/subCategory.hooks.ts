import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subCategoryApi } from "./subCategory.api";
import { categoryKeys } from "../category/category.hooks";
import {
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
  SubCategoryFilters,
} from "@/types/subCategory/subCategory.types";
import { toast } from "sonner";

export const subCategoryKeys = {
  all: ["subCategories"] as const,
  lists: () => [...subCategoryKeys.all, "list"] as const,
  list: (filters?: SubCategoryFilters) =>
    [...subCategoryKeys.lists(), filters] as const,
  details: () => [...subCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...subCategoryKeys.details(), id] as const,
};

export const useSubCategoryList = (filters?: SubCategoryFilters) => {
  return useQuery({
    queryKey: subCategoryKeys.list(filters),
    queryFn: () => subCategoryApi.getSubCategories(filters),
  });
};

export const useSubCategoryById = (id: string) => {
  return useQuery({
    queryKey: subCategoryKeys.detail(id),
    queryFn: () => subCategoryApi.getSubCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubCategoryPayload) =>
      subCategoryApi.createSubCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("SubCategory created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create subcategory");
    },
  });
};

export const useUpdateSubCategory = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSubCategoryPayload) =>
      subCategoryApi.updateSubCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("SubCategory updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update subcategory");
    },
  });
};

export const useToggleSubCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      subCategoryApi.toggleStatus(id, isActive),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success(
        `SubCategory ${isActive ? "activated" : "deactivated"} (cascaded to products)`,
      );
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update status");
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subCategoryApi.deleteSubCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("SubCategory and its products deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete subcategory");
    },
  });
};
