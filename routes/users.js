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

export default router;