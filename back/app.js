// server.js
import express from "express";

const app = express();
const PORT = 3000;

// Ruta principal
app.get("/", (req, res) => {
    res.send("Hello World desde Express 🚀");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
