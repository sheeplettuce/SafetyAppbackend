import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();

// CORS permisivo - acepta de cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Log para ver las peticiones
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando desde cualquier red" });
});

// Importa tus rutas
import usersRoutes from "./routes/users.js";
import contactsRoutes from "./routes/contacts.js";

app.use("/users", usersRoutes);
app.use("/contacts", contactsRoutes);

const PORT = 3000;

// Escuchar en todas las interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en todas las interfaces`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Red local: http://[tu-ip-local]:${PORT}`);
  console.log(`🌍 Accesible desde cualquier red (si configuras port forwarding)`);
});