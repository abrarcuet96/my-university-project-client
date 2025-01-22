import { z } from "zod";

export const academicSemesterSchema = z.object({
  name: z.string({ required_error: "Please selecr a name" }),
  year: z.string({ required_error: "Please selecr a year" }),
  startMonth: z.string({ required_error: "Please selecr a start month" }),
  endMonth: z.string({ required_error: "Please selecr an end month" }),
});
