import { z } from "zod";

const createSpecialtiesValidation = z.object({
  title: z.string({
    required_error: "Title is requiest",
  }),
});

export const SpecialtiesValidation = {
  createSpecialtiesValidation,
};
