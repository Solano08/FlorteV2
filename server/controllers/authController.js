// server/controllers/authController.js
require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_example';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Registro de usuario
 * POST /api/auth/register
 * body: { nombre_completo, correo, password }
 */
exports.register = async (req, res) => {
  try {
    const { nombre_completo = '', correo = '', password = '' } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
    }

    // Normalizar correo
    const email = correo.trim().toLowerCase();

    // Verificar si ya existe
    const [rows] = await pool.execute('SELECT id FROM usuarios WHERE correo = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Usuario ya existe.' });
    }

    // Hashear contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre_completo, correo, password_bcrypt, rol) VALUES (?, ?, ?, ?)',
      [nombre_completo, email, hashed, 'user']
    );

    const user = {
      id: result.insertId,
      nombre_completo,
      correo: email,
      rol: 'user'
    };

    // Generar token (payload simple)
    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: 'Usuario creado.',
      user,
      token
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

/**
 * Login
 * POST /api/auth/login
 * body: { correo, password }
 */
exports.login = async (req, res) => {
  try {
    const { correo = '', password = '' } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
    }

    const email = correo.trim().toLowerCase();

    const [rows] = await pool.execute(
      'SELECT id, nombre_completo, correo, password_bcrypt, rol FROM usuarios WHERE correo = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_bcrypt);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: 'Autenticado.',
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        rol: user.rol,
      },
      token
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
