import { SubCategoryFormValues } from "@/types/subCategory/subCategory.types";
import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";

export const getSubCategoryDefaultValues = (
  parentId: string,
): SubCategoryFormValues => ({
  name: EMPTY_TRANSLATION,
  slug: "",
  description: EMPTY_TRANSLATION,
  parent: parentId,
});
