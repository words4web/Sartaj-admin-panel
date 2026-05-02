import { z } from "zod";
import { PREFECTURES } from "@/constants/prefectures";

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^\d{3}-\d{4}$/, "Postal code must be in format XXX-XXXX"),
  prefecture: z
    .string()
    .min(1, "Prefecture is required")
    .refine((val) => PREFECTURES.some((p) => p.code === val), {
      message: "Invalid prefecture selection",
    }),
  city: z.string().min(1, "City is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  building: z.string().optional(),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\+81\d{9,10}$/, "Invalid Japan phone number format"),
});

export const createCustomerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\+81\d{9,10}$/, "Invalid Japan phone number format"),
  superCategory: z.string().min(1, "Super category is required"),
  priceList: z.string().optional(),
  addresses: z.array(addressSchema).min(1, "At least one address is required"),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
