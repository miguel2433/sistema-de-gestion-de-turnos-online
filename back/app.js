// server.js
import express from "express";
import mysql from "mysql2";

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

await connection.query('CREATE DATABASE IF NOT EXISTS sistema-gestion-turnos-online')
await connection.end()

const app = express();



// Ruta principal
app.get("/", (req, res) => {
    res.send("Hello World desde Express 🚀");
});

// Iniciar servidor
app.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
