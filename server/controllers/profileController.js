const db = require("../config/db");
const { buildPublicPath } = require("../utils/fileStorage");
const {
  parsePositiveInt,
  normalizeString,
  normalizeEmail,
  isValidEmail,
} = require("../utils/validation");

const baseSelectFields =
  "id, nombre_completo, correo, avatar_url, portada_url, bio, github_url, linkedin_url, ubicacion, ocupacion, fecha_union, rol, ultima_conexion, deleted_at";

const loadProfile = async (userId) => {
  const [rows] = await db.execute(
    `SELECT ${baseSelectFields} FROM usuarios WHERE id = ? AND deleted_at IS NULL`,
    [userId]
  );
  return rows[0] ?? null;
};

const buildProfileResponse = async (userId) => {
  const profile = await loadProfile(userId);

  if (!profile) {
    return null;
  }

  const [[projectCount]] = await db.execute(
    "SELECT COUNT(*) AS total FROM usuario_proyectos WHERE usuario_id = ?",
    [userId]
  );

  const [[connectionCount]] = await db.execute(
    `
      SELECT COUNT(*) AS total
      FROM (
        SELECT seguido_id AS relacionado FROM seguidores WHERE seguidor_id = ?
        UNION
        SELECT seguidor_id AS relacionado FROM seguidores WHERE seguido_id = ?
      ) AS conexiones
    `,
    [userId, userId]
  );

  const [[courseCount]] = await db.execute(
    "SELECT COUNT(*) AS total FROM usuario_cursos WHERE usuario_id = ?",
    [userId]
  );

  return {
    ...profile,
    stats: {
      projects: projectCount?.total ?? 0,
      connections: connectionCount?.total ?? 0,
      courses: courseCount?.total ?? 0,
    },
  };
};

exports.getProfile = async (req, res) => {
  const userId = parsePositiveInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

  try {
    const profile = await buildProfileResponse(userId);

    if (!profile) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json(profile);
  } catch (error) {
    console.error("Error en la consulta de perfil:", error);
    return res.status(500).json({ error: "Error en la base de datos" });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = parsePositiveInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

  const allowedFields = [
    "nombre_completo",
    "correo",
    "bio",
    "github_url",
    "linkedin_url",
    "ubicacion",
    "ocupacion",
    "avatar_url",
    "portada_url",
  ];

  const entries = Object.entries(req.body)
    .filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
    .map(([key, value]) => {
      if (key === "correo") {
        return [key, normalizeEmail(value)];
      }
      if (typeof value === "string") {
        const normalized = normalizeString(value);
        if (!normalized) {
          return [key, key === "nombre_completo" ? "" : null];
        }
        return [key, normalized];
      }
      return [key, value];
    });

  if (entries.length === 0) {
    return res.status(400).json({ error: "No hay campos validos para actualizar." });
  }

  const emailEntry = entries.find(([key]) => key === "correo");
  if (emailEntry && !isValidEmail(emailEntry[1])) {
    return res.status(400).json({ error: "Correo electronico no valido." });
  }

  const nameEntry = entries.find(([key]) => key === "nombre_completo");
  if (nameEntry && !normalizeString(nameEntry[1])) {
    return res.status(400).json({ error: "El nombre no puede estar vacio." });
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

    return res.json(await buildProfileResponse(userId));
  } catch (error) {
    console.error("Error en actualizacion de perfil:", error);
    return res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

exports.deleteProfile = async (req, res) => {
  const userId = parsePositiveInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

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

    return res.json({ id: userId, message: "Perfil eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    return res.status(500).json({ error: "Error al eliminar perfil" });
  }
};

exports.restoreProfile = async (req, res) => {
  const userId = parsePositiveInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

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

    const profile = await buildProfileResponse(userId);

    return res.json(profile);
  } catch (error) {
    console.error("Error al restaurar perfil:", error);
    return res.status(500).json({ error: "Error al restaurar perfil" });
  }
};

exports.uploadAvatar = async (req, res) => {
  const userId = parsePositiveInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No se recibio archivo de imagen." });
  }

  const publicPath = buildPublicPath(req.file.filename);

  try {
    await db.execute(
      "UPDATE usuarios SET avatar_url = ? WHERE id = ? AND deleted_at IS NULL",
      [publicPath, userId]
    );

    const profile = await buildProfileResponse(userId);

    return res.json({ avatar_url: publicPath, profile });
  } catch (error) {
    console.error("Error al subir avatar:", error);
    return res.status(500).json({ error: "No se pudo actualizar el avatar." });
  }
};

exports.uploadCover = async (req, res) => {
  const userId = parsePositiveInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No se recibio archivo de imagen." });
  }

  const publicPath = buildPublicPath(req.file.filename);

  try {
    await db.execute(
      "UPDATE usuarios SET portada_url = ? WHERE id = ? AND deleted_at IS NULL",
      [publicPath, userId]
    );

    const profile = await buildProfileResponse(userId);

    return res.json({ portada_url: publicPath, profile });
  } catch (error) {
    console.error("Error al subir portada:", error);
    return res.status(500).json({ error: "No se pudo actualizar la portada." });
  }
};
