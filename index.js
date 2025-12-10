import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // IMPORTANTE: para las fotos en base64
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API funcionando desde cualquier red" });
});

// Importa tus rutas
import usersRoutes from "./routes/users.js";
import contactsRoutes from "./routes/contacts.js";
import panicRoutes from "./routes/panic.js"; // <-- ASEGÚRATE DE TENER ESTO

app.use("/users", usersRoutes);
app.use("/contacts", contactsRoutes);
app.use("/panic", panicRoutes); // <-- Y ESTO

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en todas las interfaces`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Red local: http://[tu-ip-local]:${PORT}`);
});