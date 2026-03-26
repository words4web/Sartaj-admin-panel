import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// export const registerSchema = z
//   .object({
//     name: z
//       .string()
//       .nonempty("Name is required")
//       .min(2, "Name must be at least 2 characters"),
//     email: z
//       .string()
//       .nonempty("Email is required")
//       .email("Invalid email address"),
//     password: z
//       .string()
//       .nonempty("Password is required")
//       .min(6, "Password must be at least 6 characters"),
//     confirmPassword: z.string().nonempty("Please confirm your password"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// export type RegisterFormData = z.infer<typeof registerSchema>;
