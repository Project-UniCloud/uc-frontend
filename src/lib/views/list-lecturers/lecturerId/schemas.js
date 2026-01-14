import { z } from "zod";

export const editLecturerSchema = z.object({
  firstName: z
    .string()
    .min(1, "Imię jest wymagane")
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/,
      "Imię może zawierać tylko litery"
    ),
  lastName: z
    .string()
    .min(1, "Nazwisko jest wymagane")
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/,
      "Nazwisko może zawierać tylko litery"
    ),
  email: z.string().email("Nieprawidłowy format e-maila"),
});
