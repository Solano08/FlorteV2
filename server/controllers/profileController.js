// server/controllers/profileController.js
const db = require("../config/db");

// Obtener perfil por ID (público)
exports.getProfile = (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT * FROM usuarios WHERE id = ? AND deleted_at IS NULL",
    [userId],
    (err, results) => {
      if (err) {
        console.error("❌ Error en la consulta:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(results[0]);
    }
  );
};

// Actualizar perfil por ID (propietario o admin)
exports.updateProfile = (req, res) => {
  const userId = Number(req.params.id);
  const requester = req.user;

  if (!requester) return res.status(401).json({ error: "No autenticado" });
  if (Number(requester.id) !== userId && requester.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado para editar este perfil" });
  }

  const {
    nombre_completo,
    correo,
    bio,
    github_url,
    linkedin_url,
    ubicacion,
    ocupacion,
  } = req.body;

  db.query(
    `UPDATE usuarios 
     SET nombre_completo=?, correo=?, bio=?, github_url=?, linkedin_url=?, ubicacion=?, ocupacion=?
     WHERE id=? AND deleted_at IS NULL`,
    [
      nombre_completo,
      correo,
      bio,
      github_url,
      linkedin_url,
      ubicacion,
      ocupacion,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error en actualización:", err);
        return res.status(500).json({ error: "Error al actualizar perfil" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Usuario no encontrado o ya eliminado" });
      }

      // devolver perfil actualizado
      db.query(
        "SELECT * FROM usuarios WHERE id = ? AND deleted_at IS NULL",
        [userId],
        (err, results) => {
          if (err) {
            console.error("❌ Error al obtener perfil actualizado:", err);
            return res.status(500).json({ error: "Error al obtener perfil" });
          }
          res.json(results[0]);
        }
      );
    }
  );
};

// Soft delete (propietario o admin)
exports.deleteProfile = (req, res) => {
  const userId = Number(req.params.id);
  const requester = req.user;

  if (!requester) return res.status(401).json({ error: "No autenticado" });
  if (Number(requester.id) !== userId && requester.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado para eliminar este perfil" });
  }

  db.query(
    "UPDATE usuarios SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [userId],
    (err, result) => {
      if (err) {
        console.error("❌ Error al eliminar perfil:", err);
        return res.status(500).json({ error: "Error al eliminar perfil" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Usuario no encontrado o ya eliminado" });
      }

      db.query("SELECT * FROM usuarios WHERE id = ?", [userId], (err, results) => {
        if (err) {
          console.error("❌ Error al obtener perfil eliminado:", err);
          return res.status(500).json({ error: "Error al obtener perfil eliminado" });
        }
        res.json(results[0]);
      });
    }
  );
};

// Restaurar perfil (solo admin; además route usa permitRoles('admin'))
exports.restoreProfile = (req, res) => {
  const userId = Number(req.params.id);
  const requester = req.user;
  if (!requester) return res.status(401).json({ error: "No autenticado" });
  if (requester.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado para restaurar perfiles" });
  }

  db.query(
    "UPDATE usuarios SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL",
    [userId],
    (err, result) => {
      if (err) {
        console.error("❌ Error al restaurar perfil:", err);
        return res.status(500).json({ error: "Error al restaurar perfil" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Usuario no encontrado o no estaba eliminado" });
      }

      db.query("SELECT * FROM usuarios WHERE id = ?", [userId], (err, results) => {
        if (err) {
          console.error("❌ Error al obtener perfil restaurado:", err);
          return res.status(500).json({ error: "Error al obtener perfil restaurado" });
        }
        res.json(results[0]);
      });
    }
  );
};
