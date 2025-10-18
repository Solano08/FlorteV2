// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, permitRoles } = require('../middleware/authMiddleware');

// Listar todos los usuarios (solo admin)
router.get('/users', verifyToken, permitRoles('admin'), (req, res) => {
  db.query("SELECT id, nombre_completo, correo, rol, deleted_at FROM usuarios", (err, results) => {
    if (err) {
      console.error("❌ Error en consulta de usuarios:", err);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(results);
  });
});

module.exports = router;
