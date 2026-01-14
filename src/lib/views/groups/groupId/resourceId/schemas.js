import { z } from "zod";

export const resourceEditSchema = z.object({
  limit: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Limit musi być liczbą dodatnią"
    ),
  cron: z.string().min(1, "Harmonogram czyszczenia jest wymagany"),
  expiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty"),
  notificationLevel1: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      "Próg musi być liczbą od 0 do 100"
    ),
  notificationLevel2: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      "Próg musi być liczbą od 0 do 100"
    ),
  notificationLevel3: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      "Próg musi być liczbą od 0 do 100"
    ),
});
