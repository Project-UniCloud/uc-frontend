import { z } from "zod";

export const groupSearchSchema = z
  .string()
  .regex(
    /^[\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ\- ]*$/,
    "Dozwolone: litery, cyfry, spacje i myślniki"
  );

export const groupFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nazwa grupy jest wymagana")
      .regex(
        /^[\p{L}\-\s\d]+$/u,
        "Nazwa może zawierać tylko litery, cyfry, spacje i myślniki"
      ),
    academicYear: z
      .string()
      .regex(
        /(19|20)\d{2}/,
        "Rok akademicki musi być w formacie YYYY (1900-2099)"
      ),
    semesterType: z.enum(["WINTER", "SUMMER"]),
    startDate: z.string(),
    endDate: z.string(),
    lecturers: z
      .array(z.object({ id: z.string(), name: z.string() }))
      .min(1, "Co najmniej jeden prowadzący jest wymagany"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Data końcowa musi być równa lub późniejsza niż data początkowa",
    path: ["endDate"],
  });
