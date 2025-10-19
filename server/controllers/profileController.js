const db = require("../config/db");

const baseSelectFields =
  "id, nombre_completo, correo, avatar_url, bio, github_url, linkedin_url, ubicacion, ocupacion, fecha_union, deleted_at";

exports.getProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.execute(
      `SELECT ${baseSelectFields} FROM usuarios WHERE id = ? AND deleted_at IS NULL`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error en la consulta:", error);
    return res.status(500).json({ error: "Error en la base de datos" });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.params.id;
  const allowedFields = [
    "nombre_completo",
    "correo",
    "bio",
    "github_url",
    "linkedin_url",
    "ubicacion",
    "ocupacion",
    "avatar_url",
  ];

  const entries = Object.entries(req.body).filter(([key, value]) =>
    allowedFields.includes(key) && value !== undefined
  );

  if (entries.length === 0) {
    return res.status(400).json({ error: "No hay campos válidos para actualizar." });
  }

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([, value]) => value);

  try {
    const [result] = await db.execute(
      `UPDATE usuarios SET ${setClause} WHERE id = ? AND deleted_at IS NULL`,
      [...values, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado o ya eliminado" });
    }

    const [rows] = await db.execute(
      `SELECT ${baseSelectFields} FROM usuarios WHERE id = ?`,
      [userId]
    );

    return res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error en actualización:", error);
    return res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

exports.deleteProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.execute(
      "UPDATE usuarios SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado o ya eliminado" });
    }

    const [rows] = await db.execute(
      `SELECT ${baseSelectFields} FROM usuarios WHERE id = ?`,
      [userId]
    );

    return res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al eliminar perfil:", error);
    return res.status(500).json({ error: "Error al eliminar perfil" });
  }
};

exports.restoreProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.execute(
      "UPDATE usuarios SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado o no estaba eliminado" });
    }

    const [rows] = await db.execute(
      `SELECT ${baseSelectFields} FROM usuarios WHERE id = ?`,
      [userId]
    );

    return res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al restaurar perfil:", error);
    return res.status(500).json({ error: "Error al restaurar perfil" });
  }
};
