import { z } from "zod";
import { especialidadSchema } from "./especialidad.js";

export const turnoSchema = z.object({
  fecha_turno: z.string({ required_error: "La fecha del turno es obligatoria" }),
  hora_turno: z.string().optional(),
  estado: z
    .enum(["pendiente", "confirmado", "atendido", "cancelado", "no_presentado"]) 
    .optional(),
  motivo_consulta: z.string().optional(),
  observaciones: z.string().optional(),
  especialidad: z.object({
    id_especialidad: z.coerce.number().int().positive(),
  }),
  id_profesional: z.coerce.number().int().positive(),
  id_sede: z.coerce.number().int().positive(),
  id_usuario: z.coerce.number().int().positive().optional(),
});
