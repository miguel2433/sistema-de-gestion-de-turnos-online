import {z, ZodDefault} from "zod"


export const usuarioSchema = z.object({
  nombre: z.string({
    required_error: "el nombre es obligatorio",
    invalid_type_error: "el nombre debe ser un texto",
  }),
  apellido: z.string({
    required_error: "el apellido es obligatorio",
    invalid_type_error: "el apellido debe ser un texto",
  }),
  email: z
    .string({
      required_error: "el email es obligatorio",
      invalid_type_error: "El email debe ser un texto",
    })
    .email("El email debe ser un formato valido"),
  password:z
  .string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser un texto"
  }),
  telefono: z
  .string({
    invalid_type_error: "El telefono debe ser un texto"
  }).optional(),
  dni:z
  .string({
    required_error: "El dni es obligatorio",
    invalid_type_error: "El dni debe ser un texto"
  }).min(7).max(8),
  activo:z.union([z.boolean(), z.number().transform((n) => Boolean(n))]),
  rol: z.enum(['paciente','admin','recepcionista',]).default('paciente').optional(),
  fecha_creacion: z.date().optional()
});