import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(1, { message: "Niepoprawny indeks!" }),
  password: z.string().min(1, { message: "Hasło jest wymagane!" }),
});
