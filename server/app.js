// server/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // si existe
const adminRoutes = require('./routes/adminRoutes');     // si existe

const app = express();

// Middlewares
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: "http://localhost:8080", // cambia al dominio real en producción
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => res.send("API de FlorteV2 funcionando 🚀"));

// montar rutas (todas bajo /api)
app.use("/api", authRoutes);      // /api/auth/login , /api/auth/register
if (profileRoutes) app.use("/api", profileRoutes);
if (adminRoutes) app.use("/api", adminRoutes);

// catch-all error handler (opcional simple)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
