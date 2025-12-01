import { z } from "zod";
import { rolSchema } from "./rol.js";

export const profesionalSchema = z.object({
  id_profesional: z.coerce.number().int().positive().optional(),
  nombre: z.string({ required_error: "El nombre es obligatorio" }),
  apellido: z.string({ required_error: "El apellido es obligatorio" }),
  email: z
    .string({ required_error: "El email es obligatorio" })
    .email("El email debe ser válido"),
  telefono: z.string().optional(),
  matricula: z.string({ required_error: "La matrícula es obligatoria" }),
  password: z.string({ required_error: "La contraseña es obligatoria" }),
  id_especialidad: z.coerce.number().int().positive({ message: "id_especialidad inválido" }),
  id_sede:z.coerce.number().int().positive({ message: "id_sede inválido" }),
  activo: z.union([z.boolean(), z.number().transform((n) => Boolean(n))]).optional(),
  rol: rolSchema.pick({ id_rol: true, nombre_rol: true, descripcion: true }).optional(),
});
