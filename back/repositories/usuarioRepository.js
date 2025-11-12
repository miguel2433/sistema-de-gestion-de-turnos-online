import db from "../db.js"; 

export const usuarioRepository = {
  async getAll() {
    try {
      const usuarios = await db("Usuario").select("*"); 

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
        const user = await db("usuario").where({email}).select("*").first()

      if (!user) {
        throw new Error("No existe un usuario con este email");
      }
        return user
    }
    catch(error){
        console.error("Error al obtener usuario:", error.message)
        throw error;
    }
  }
};
