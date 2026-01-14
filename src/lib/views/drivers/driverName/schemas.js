import { z } from "zod";

export const editDriverSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  limit: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Limit kosztów musi być liczbą dodatnią"
    ),
  clean: z.string().min(1, "Wyrażenie CRON jest wymagane"),
});
