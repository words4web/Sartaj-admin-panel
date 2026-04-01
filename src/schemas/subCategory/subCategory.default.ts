import { SubCategoryFormValues } from "@/types/subCategory/subCategory.types";

export const getSubCategoryDefaultValues = (
  parentId: string,
): SubCategoryFormValues => ({
  name: "",
  description: "",
  parent: parentId,
});
