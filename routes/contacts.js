import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Obtener todos los contactos
router.get("/", (req, res) => {
  db.query("SELECT idcontact as id, name, phonenumber FROM contacts", (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

// Crear nuevo contacto
router.post("/", (req, res) => {
  const { name, phonenumber } = req.body;
  const user_id = 1; // TODO: obtener del login
  
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "El nombre es requerido" });
  }

  db.query(
    "INSERT INTO contacts (user_id, name, phonenumber) VALUES (?, ?, ?)",
    [user_id, name.trim(), phonenumber || ''],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        id: result.insertId, 
        name: name.trim(),
        phonenumber: phonenumber || ''
      });
    }
  );
});

// Actualizar contacto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, phonenumber } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "El nombre es requerido" });
  }

  db.query(
    "UPDATE contacts SET name = ?, phonenumber = ? WHERE idcontact = ?",
    [name.trim(), phonenumber || '', id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contacto no encontrado" });
      }
      res.json({ 
        id: parseInt(id),
        name: name.trim(),
        phonenumber: phonenumber || ''
      });
    }
  );
});

// Eliminar contacto
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM contacts WHERE idcontact = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contacto no encontrado" });
      }
      res.json({ message: "Contacto eliminado" });
    }
  );
});

export default router;