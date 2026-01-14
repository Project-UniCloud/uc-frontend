import { z } from "zod";

export const groupSearchSchema = z
  .string()
  .regex(
    /^[\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ\- ]*$/,
    "Dozwolone: litery, cyfry, spacje i myślniki"
  );

export const groupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nazwa grupy jest wymagana")
      .regex(/^[\p{L}\-\s\d]+$/u, {
        message:
          "Nieprawidłowa nazwa grupy. Dozwolone: litery, cyfry, spacje i myślnik.",
      }),
    semesterYear: z
      .string()
      .min(1, "Rok semestru jest wymagany")
      .regex(/(19|20)\d{2}/, {
        message: "Rok musi być w przedziale: 1900-2099",
      }),
    semesterType: z.enum(["Z", "L"], {
      errorMap: () => ({ message: "Nieprawidłowy typ semestru" }),
    }),
    startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
    endDate: z.string().min(1, "Data zakończenia jest wymagana"),
    lecturers: z
      .array(z.union([z.string(), z.number()]))
      .min(1, "Wymagany jest co najmniej jeden prowadzący"),
    description: z.string().optional(),
  })
  .refine((vals) => new Date(vals.startDate) <= new Date(vals.endDate), {
    message: "Data zakończenia musi być późniejsza niż data rozpoczęcia",
    path: ["endDate"],
  });
