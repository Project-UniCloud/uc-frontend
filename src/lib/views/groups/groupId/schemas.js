import { z } from "zod";

export const groupSchema = z
  .object({
    name: z.string().min(1, "Nazwa jest wymagana"),
    lecturers: z
      .array(
        z.object({
          id: z.union([z.number(), z.string()]),
          fullName: z.string(),
        })
      )
      .min(1, "Wymagany co najmniej jeden prowadzący"),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty"),
    description: z.string().optional().default(""),
    status: z.string(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Data rozpoczęcia nie może być późniejsza niż data zakończenia",
    path: ["startDate"],
  });

export const studentSchema = z.object({
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
  login: z
    .string()
    .regex(/^s\d{6}$/, 'Indeks musi zaczynać się od "s" i mieć 6 cyfr'),
  email: z.string().email("Nieprawidłowy format e-maila"),
});
