const crypto = require("crypto");
const db = require("../config/db");

const hashPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

const sanitizeUser = (user) => {
  if (!user) return null;
  const { contraseña: _password, ...rest } = user;
  return rest;
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nombre, correo y contraseña son requeridos." });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const [existing] = await db.execute(
      "SELECT id FROM usuarios WHERE correo = ?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado." });
    }

    const [result] = await db.execute(
      `INSERT INTO usuarios (nombre_completo, correo, contraseña, fecha_union)
       VALUES (?, ?, ?, NOW())`,
      [name.trim(), normalizedEmail, hashPassword(password)]
    );

    const [rows] = await db.execute(
      `SELECT id, nombre_completo, correo, avatar_url, bio, github_url, linkedin_url, ubicacion, ocupacion, fecha_union
       FROM usuarios WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ user: rows[0] });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ error: "No se pudo completar el registro." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos." });
  }

  try {
    const [rows] = await db.execute(
      `SELECT id, nombre_completo, correo, contraseña, avatar_url, bio, github_url, linkedin_url, ubicacion, ocupacion, fecha_union
       FROM usuarios WHERE correo = ? AND deleted_at IS NULL`,
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const user = rows[0];

    if (user.contraseña !== hashPassword(password)) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "No se pudo iniciar sesión." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "Correo y nueva contraseña son requeridos." });
  }

  try {
    const [result] = await db.execute(
      `UPDATE usuarios SET contraseña = ? WHERE correo = ? AND deleted_at IS NULL`,
      [hashPassword(newPassword), email.toLowerCase()]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No existe un usuario activo con ese correo." });
    }

    return res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la contraseña." });
  }
};
