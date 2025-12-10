import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

// Crear usuario
router.post("/", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) return res.json(err);
      res.json({ message: "Usuario creado", id: result.insertId });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, data) => {
      if (err) return res.json({ success: false, error: err });
      
      if (data.length > 0) {
        res.json({ 
          success: true, 
          user: {
            id: data[0].id,
            username: data[0].username
          }
        });
      } else {
        res.json({ success: false, message: "Credenciales incorrectas" });
      }
    }
  );
});

// Obtener contactos de un usuario
router.get("/contacts/:userId", (req, res) => {
  const { userId } = req.params;
  
  db.query(
    "SELECT * FROM contacts WHERE user_id = ?",
    [userId],
    (err, data) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ success: true, contacts: data });
    }
  );
});

// Crear nuevo contacto
router.post("/contacts", (req, res) => {
  const { user_id, name, phonenumber } = req.body;

  db.query(
    "INSERT INTO contacts (user_id, name, phonenumber) VALUES (?, ?, ?)",
    [user_id, name, phonenumber],
    (err, result) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ 
        success: true, 
        message: "Contacto creado", 
        contactId: result.insertId 
      });
    }
  );
});

// Eliminar contacto
router.delete("/contacts/:contactId", (req, res) => {
  const { contactId } = req.params;

  db.query(
    "DELETE FROM contacts WHERE idcontact = ?",
    [contactId],
    (err, result) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ success: true, message: "Contacto eliminado" });
    }
  );
});

export default router;