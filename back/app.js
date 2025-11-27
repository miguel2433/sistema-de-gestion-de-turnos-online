import express from "express";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoute.js"
import authRoutes from "./routes/authRoute.js"
import turnoRoutes from "./routes/turnoRoute.js"
import especialidadRoutes from "./routes/especialidadRoute.js"
import profesionalRoutes from "./routes/profesionalRoute.js"
import sedeRoutes from "./routes/sedeRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World desde Express 🚀");
});

app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);
app.use("/turnos", turnoRoutes);
app.use("/especialidades", especialidadRoutes);
app.use("/profesionales", profesionalRoutes);
app.use("/sedes", sedeRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server en LAN escuchando en puerto 5000");
});
