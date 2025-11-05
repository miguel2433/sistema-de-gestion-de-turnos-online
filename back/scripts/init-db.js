import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    await connection.query("DROP DATABASE IF EXISTS sistema_gestion_turnos_online")
    await connection.query("CREATE DATABASE IF NOT EXISTS sistema_gestion_turnos_online");
    await connection.end();

    console.log("Base de datos creada o verificada correctamente.");
  } catch (error) {
    console.error("Error al crear la base de datos:", error);
  }
}

createDatabase();
