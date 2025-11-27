import { z } from "zod";

export const sedeSchema = z.object({
  nombre: z.string({ required_error: "El nombre es obligatorio" }),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  activa: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]).optional(),
  horario_apertura: z.string().optional(),
  horario_cierre: z.string().optional(),
});
