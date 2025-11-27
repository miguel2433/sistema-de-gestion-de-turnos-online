import {z, ZodDefault} from "zod"

export const rolSchema = z.object({
  id_rol: z.coerce.number().int().positive(),
  nombre_rol: z.string({
    required_error: "el nombre es obligatorio",
    invalid_type_error: "el nombre debe ser un texto",
  }),
  descripcion: z.string({
    required_error: "la descripcion es obligatoria",
    invalid_type_error: "la descripcion debe ser un texto",
  }),
  activo: z.boolean({
    required_error: "el estado es obligatorio",
    invalid_type_error: "el estado debe ser un booleano",
  }),
  fecha_creacion: z.date({
    required_error: "la fecha de creacion es obligatoria",
    invalid_type_error: "la fecha de creacion debe ser una fecha",
  }),
  fecha_modificacion: z.date({
    required_error: "la fecha de modificacion es obligatoria",
    invalid_type_error: "la fecha de modificacion debe ser una fecha",
  }),
})
