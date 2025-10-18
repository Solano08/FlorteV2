// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoints: mounted under /api en app.js
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

module.exports = router;
