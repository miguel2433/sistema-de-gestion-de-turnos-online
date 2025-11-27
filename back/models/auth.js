import { z } from "zod";
import { usuarioSchema } from "./usuario.js";
import { rolSchema } from "./rol.js";

export const registerSchema = usuarioSchema
  .pick({
    nombre: true,
    apellido: true,
    email: true,
    password: true,
    telefono: true,
    dni: true,
  })
  .extend({
    rol: rolSchema.pick({ id_rol: true }).optional(),
  })
  .partial({ telefono: true });

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "el email es obligatorio",
      invalid_type_error: "El email debe ser un texto",
    })
    .email("El email debe ser un formato valido"),
  password: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser un texto",
  }),
});
