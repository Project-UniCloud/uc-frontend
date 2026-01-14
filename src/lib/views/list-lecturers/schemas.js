import { z } from "zod";

export const addLecturerSchema = z.object({
  firstName: z
    .string()
    .nullish()
    .default("")
    .refine((val) => val && val.trim().length > 0, "Imię jest wymagane")
    .refine(
      (val) => /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(val || ""),
      "Imię może zawierać tylko litery"
    ),
  lastName: z
    .string()
    .nullish()
    .default("")
    .refine((val) => val && val.trim().length > 0, "Nazwisko jest wymagane")
    .refine(
      (val) => /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/.test(val || ""),
      "Nazwisko może zawierać tylko litery"
    ),
  login: z
    .string()
    .nullish()
    .default("")
    .refine((val) => val && val.trim().length > 0, "Indeks jest wymagany"),
  email: z
    .string()
    .nullish()
    .default("")
    .refine((val) => val && val.trim().length > 0, "Email jest wymagany")
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val || ""),
      "Nieprawidłowy format e-maila"
    ),
});
