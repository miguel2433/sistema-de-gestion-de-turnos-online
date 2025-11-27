import { z } from "zod";

export const especialidadSchema = z.object({
  id_especialidad: z.coerce.number().int().positive().optional(),
  nombre_especialidad: z.string({
    required_error: "El nombre de la especialidad es obligatorio",
    invalid_type_error: "El nombre de la especialidad debe ser un texto",
  }),
  descripcion: z.string().optional(),
  activa: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]).optional(),
});
