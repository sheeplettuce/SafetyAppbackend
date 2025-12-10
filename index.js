import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Importa tus rutas
import usersRoutes from "./routes/users.js";
app.use("/users", usersRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
