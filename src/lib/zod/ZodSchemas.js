import { z } from "zod";

export const createGroupSchema = z.object({
  groupName: z.string().nonempty("Nazwa grupy nie może być pusta"),
  semesterYear: z.string().regex(/^\d{4}$/, "Rok musi składać się z 4 cyfr"),
  semesterType: z.enum(["Z", "L"], {
    errorMap: () => ({ message: "Nieprawidłowy typ semestru: Z albo L" }),
  }),
  startDate: z.string().nonempty("Data rozpoczęcia jest wymagana"),
  endDate: z.string().nonempty("Data zakończenia jest wymagana"),
  description: z.string().optional(),
  lecturers: z
    .array(z.string().uuid())
    .min(1, "Wybierz co najmniej jednego prowadzącego"),
});
