const bcrypt = require("bcryptjs");
const db = require("../config/db");
const {
  normalizeEmail,
  normalizeString,
  isValidEmail,
} = require("../utils/validation");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

const verifyPassword = (password, hash) =>
  bcrypt.compare(password, hash);

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_bcrypt: _password, ...rest } = user;
  return rest;
};

// ------------------ REGISTRO ------------------
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nombre, correo y contrasena son requeridos." });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeString(name);
    const passwordValue =
      typeof password === "string" ? password.trim() : String(password ?? "");

    if (!normalizedName) {
      return res.status(400).json({ error: "El nombre no puede estar vacio." });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Formato de correo no valido." });
    }

    if (passwordValue.length < 6) {
      return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres." });
    }

    const [existing] = await db.execute(
      "SELECT id FROM usuarios WHERE correo = ?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "El correo ya esta registrado." });
    }

    const [result] = await db.execute(
      `INSERT INTO usuarios (nombre_completo, correo, password_bcrypt, fecha_union, ultima_conexion)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [normalizedName, normalizedEmail, await hashPassword(passwordValue)]
    );

    const [rows] = await db.execute(
      `SELECT id, nombre_completo, correo, avatar_url, portada_url, bio, github_url, linkedin_url, ubicacion, ocupacion, fecha_union, rol, ultima_conexion
       FROM usuarios WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ error: "No se pudo completar el registro." });
  }
};

// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Correo y contrasena son requeridos." });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const passwordValue =
      typeof password === "string" ? password.trim() : String(password ?? "");

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Formato de correo no valido." });
    }

    const [rows] = await db.execute(
      `SELECT id, nombre_completo, correo, password_bcrypt, avatar_url, portada_url, bio, github_url, linkedin_url, ubicacion, ocupacion, fecha_union, rol, ultima_conexion
       FROM usuarios WHERE correo = ? AND deleted_at IS NULL`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales invalidas." });
    }

    const user = rows[0];

    const isValidPassword = await verifyPassword(passwordValue, user.password_bcrypt);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales invalidas." });
    }

    await db.execute(
      "UPDATE usuarios SET ultima_conexion = NOW() WHERE id = ?",
      [user.id]
    );

    const [updatedRows] = await db.execute(
      `SELECT id, nombre_completo, correo, avatar_url, portada_url, bio, github_url, linkedin_url, ubicacion, ocupacion, fecha_union, rol, ultima_conexion
       FROM usuarios WHERE id = ?`,
      [user.id]
    );

    return res.json({ user: sanitizeUser(updatedRows[0]) });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "No se pudo iniciar sesion." });
  }
};

// ------------------ RESTABLECER CONTRASENA ------------------
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "Correo y nueva contrasena son requeridos." });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const passwordValue =
      typeof newPassword === "string"
        ? newPassword.trim()
        : String(newPassword ?? "");

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Formato de correo no valido." });
    }

    if (passwordValue.length < 6) {
      return res
        .status(400)
        .json({ error: "La nueva contrasena debe tener al menos 6 caracteres." });
    }

    const [result] = await db.execute(
      `UPDATE usuarios SET password_bcrypt = ? WHERE correo = ? AND deleted_at IS NULL`,
      [await hashPassword(passwordValue), normalizedEmail]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No existe un usuario activo con ese correo." });
    }

    return res.json({ message: "Contrasena actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar contrasena:", error);
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la contrasena." });
  }
};
