import { useQuery } from "@tanstack/react-query";
import { superCategoryApi } from "./superCategory.api";

export const superCategoryKeys = {
  all: ["superCategories"] as const,
  lists: () => [...superCategoryKeys.all, "list"] as const,
};

export const useSuperCategories = () => {
  return useQuery({
    queryKey: superCategoryKeys.lists(),
    queryFn: superCategoryApi.getSuperCategories,
    staleTime: 1000 * 60 * 60 * 1,
  });
};
