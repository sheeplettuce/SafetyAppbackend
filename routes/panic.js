import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Guardar foto de pánico
router.post("/photo", (req, res) => {
  const { user_id, photo_base64 } = req.body;

  if (!photo_base64) {
    return res.status(400).json({ success: false, message: "No se recibió foto" });
  }

  db.query(
    "INSERT INTO user_photos (user_id, photo_url, uploaded_at) VALUES (?, ?, NOW())",
    [user_id, photo_base64],
    (err, result) => {
      if (err) {
        console.error("Error guardando foto:", err);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ 
        success: true, 
        photo_id: result.insertId,
        message: "Foto guardada correctamente" 
      });
    }
  );
});

// Guardar ubicación
router.post("/location", (req, res) => {
  const { user_id, latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: "Ubicación incompleta" });
  }

  db.query(
    "INSERT INTO user_locations (user_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())",
    [user_id, latitude, longitude],
    (err, result) => {
      if (err) {
        console.error("Error guardando ubicación:", err);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ 
        success: true, 
        location_id: result.insertId,
        message: "Ubicación guardada" 
      });
    }
  );
});

// Registrar activación de pánico completa
router.post("/activate", (req, res) => {
  const { user_id, latitude, longitude, photo_id } = req.body;

  db.query(
    "INSERT INTO panic_logs (user_id, latitude, longitude, photo_id, activated_at) VALUES (?, ?, ?, ?, NOW())",
    [user_id, latitude, longitude, photo_id || null],
    (err, result) => {
      if (err) {
        console.error("Error registrando pánico:", err);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ 
        success: true, 
        panic_id: result.insertId,
        message: "Pánico registrado correctamente" 
      });
    }
  );
});

// Obtener historial de pánicos de un usuario
router.get("/history/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    `SELECT p.*, ph.photo_url 
     FROM panic_logs p 
     LEFT JOIN user_photos ph ON p.photo_id = ph.id 
     WHERE p.user_id = ? 
     ORDER BY p.activated_at DESC`,
    [userId],
    (err, data) => {
      if (err) {
        console.error("Error obteniendo historial:", err);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, history: data });
    }
  );
});

export default router;