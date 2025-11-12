import express from "express";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoute.js"

dotenv.config();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World desde Express 🚀");
});

app.use("/usuarios", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
