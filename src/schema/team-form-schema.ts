// schemas/team-schema.ts
import { z } from "zod";

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  playerCount: z
    .number()
    .min(1, "Must have at least 1 player")
    .max(15, "Maximum 15 players allowed"),
  region: z
    .string()
    .min(2, "Region must be at least 2 characters")
    .max(30, "Region must be at most 30 characters"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(30, "Country must be at most 30 characters"),
});

export type TeamFormData = z.infer<typeof teamFormSchema>;
