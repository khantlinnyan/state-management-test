import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot be longer than 20 characters")
    .nonempty("Username is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
