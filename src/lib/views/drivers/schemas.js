import { z } from "zod";

export const addDriverSchema = z.object({
  cloudConnectorId: z.string().min(1, "ID sterownika jest wymagane"),
  name: z.string().min(1, "Nazwa jest wymagana"),
  host: z.string().min(1, "Host jest wymagany"),
  port: z.coerce
    .number({ invalid_type_error: "Port musi być liczbą" })
    .min(1, "Port musi być większy od 0")
    .max(65535, "Port nie może być większy niż 65535"),
  defaultCostLimit: z
    .union([z.string(), z.number()])
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Limit kosztów musi być liczbą dodatnią"
    ),
  cronExpression: z.string().min(1, "Wyrażenie CRON jest wymagane"),
});
