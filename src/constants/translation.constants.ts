import { TranslationField } from "@/components/common/TranslationInput";

/**
 * Returns the standard translation fields (Name + Description) used in most forms.
 * @param nameLabel Customizable label for the name field (e.g. "Category Name")
 * @returns Array of TranslationField definitions
 */
export const getStandardTranslationFields = (
  nameLabel: string,
): TranslationField[] => [
  { key: "name", label: nameLabel, required: true },
  {
    key: "description",
    label: "Description",
    required: true,
    multiline: true,
    rows: 4,
  },
];
