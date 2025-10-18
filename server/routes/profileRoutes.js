// server/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware condicional para verificar token solo si NO viene del frontend
function conditionalVerifyToken(req, res, next) {
  const origin = req.headers.origin;

  // Cambia esto por la URL de tu app (por ejemplo, localhost o dominio del despliegue)
  const allowedOrigins = ['http://localhost:5000', 'https://florte.app'];

  if (allowedOrigins.includes(origin)) {
    // Si viene de tu app, omite el token
    return next();
  }

  // Si viene de otro sitio (como Postman), exige el token
  return verifyToken(req, res, next);
}

// GET: ver perfil
router.get('/profile/:id', profileController.getProfile);

// PUT: actualizar perfil (sin token si viene del frontend)
router.put('/profile/:id', conditionalVerifyToken, profileController.updateProfile);

// DELETE: solo admin o con token válido
router.delete('/profile/:id', verifyToken, profileController.deleteProfile);

// RESTORE: solo admin
router.patch('/profile/:id/restore', verifyToken, profileController.restoreProfile);

module.exports = router;
