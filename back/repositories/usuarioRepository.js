import db from "../db.js"; 

export const usuarioRepository = {
  async getAll() {
    try {
      const rows = await db("usuario as u")
        .leftJoin("rol as r", "u.id_rol", "r.id_rol")
        .select(
          "u.*",
          "r.id_rol as r_id_rol",
          "r.nombre_rol as r_nombre_rol",
          "r.descripcion as r_descripcion"
        );

      const usuarios = rows.map((row) => ({
        ...row,
        rol: row.r_id_rol
          ? {
              id_rol: row.r_id_rol,
              nombre_rol: row.r_nombre_rol,
              descripcion: row.r_descripcion,
            }
          : null,
      }));

      if (usuarios.length === 0) {
        throw new Error(
          "No hay usuarios registrados todavía en la base de datos"
        );
      }

      return usuarios;
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
      throw error;
    }
  },
  async getUserByEmail(email){
    try{
        const row = await db("usuario as u")
          .leftJoin("rol as r", "u.id_rol", "r.id_rol")
          .where({ "u.email": email })
          .select(
            "u.*",
            "r.id_rol as r_id_rol",
            "r.nombre_rol as r_nombre_rol",
            "r.descripcion as r_descripcion"
          )
          .first();
        const user = row
          ? {
              ...row,
              rol: row.r_id_rol
                ? {
                    id_rol: row.r_id_rol,
                    nombre_rol: row.r_nombre_rol,
                    descripcion: row.r_descripcion,
                  }
                : null,
            }
          : null;

      if (!user) {
        throw new Error("No existe un usuario con este email");
      }
        return user
    }
    catch(error){
        console.error("Error al obtener usuario:", error.message)
        throw error;
    }
  },
  async findByEmail(email) {
    try {
      const row = await db("usuario as u")
        .leftJoin("rol as r", "u.id_rol", "r.id_rol")
        .where({ "u.email": email })
        .select(
          "u.*",
          "r.id_rol as r_id_rol",
          "r.nombre_rol as r_nombre_rol",
          "r.descripcion as r_descripcion"
        )
        .first();
      if (!row) return null;
      return {
        ...row,
        rol: row.r_id_rol
          ? {
              id_rol: row.r_id_rol,
              nombre_rol: row.r_nombre_rol,
              descripcion: row.r_descripcion,
            }
          : null,
      };
    } catch (error) {
      console.error("Error al buscar usuario por email:", error.message);
      throw error;
    }
  },
  async findByDni(dni) {
    try {
      const row = await db("usuario as u")
        .leftJoin("rol as r", "u.id_rol", "r.id_rol")
        .where({ "u.dni": dni })
        .select(
          "u.*",
          "r.id_rol as r_id_rol",
          "r.nombre_rol as r_nombre_rol",
          "r.descripcion as r_descripcion"
        )
        .first();
      if (!row) return null;
      return {
        ...row,
        rol: row.r_id_rol
          ? {
              id_rol: row.r_id_rol,
              nombre_rol: row.r_nombre_rol,
              descripcion: row.r_descripcion,
            }
          : null,
      };
    } catch (error) {
      console.error("Error al buscar usuario por DNI:", error.message);
      throw error;
    }
  },
  async create(data) {
    try {
      let idRol = data.rol?.id_rol;
      if (!idRol) {
        const rolUsuario = await db("rol").where({ nombre_rol: "Usuario" }).first();
        idRol = rolUsuario?.id_rol ?? null;
      }

      const [id] = await db("usuario").insert({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        telefono: data.telefono ?? null,
        dni: data.dni,
        activo: data.activo ?? true,
        id_rol: idRol,
      });

      const row = await db("usuario as u")
        .leftJoin("rol as r", "u.id_rol", "r.id_rol")
        .where({ "u.id_usuario": id })
        .select(
          "u.*",
          "r.id_rol as r_id_rol",
          "r.nombre_rol as r_nombre_rol",
          "r.descripcion as r_descripcion"
        )
        .first();
      return {
        ...row,
        rol: row.r_id_rol
          ? {
              id_rol: row.r_id_rol,
              nombre_rol: row.r_nombre_rol,
              descripcion: row.r_descripcion,
            }
          : null,
      };
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
      throw error;
    }
  }
};
