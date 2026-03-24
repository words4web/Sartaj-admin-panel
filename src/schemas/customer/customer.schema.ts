import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9\-\+\(\)\s]*$/, "Invalid phone number format"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(50, "City must be less than 50 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(50, "State must be less than 50 characters"),
  zipCode: z
    .string()
    .min(1, "Zip code is required")
    .regex(/^[0-9\-]*$/, "Invalid zip code format"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(50, "Country must be less than 50 characters"),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
