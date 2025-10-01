const db = require("../config/db");

// ✅ Obtener perfil por ID (ignora eliminados con soft delete)
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

// ✅ Actualizar perfil por ID (ignora eliminados)
exports.updateProfile = (req, res) => {
  const userId = req.params.id;
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

      // 🔄 Devolver el perfil actualizado
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

// ✅ Soft delete (marca deleted_at en lugar de borrar físicamente)
exports.deleteProfile = (req, res) => {
  const userId = req.params.id;

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

      // 🔄 Devolver el perfil (ya eliminado con deleted_at)
      db.query("SELECT * FROM usuarios WHERE id = ?", [userId], (err, results) => {
        if (err) {
          console.error("❌ Error al obtener perfil eliminado:", err);
          return res.status(500).json({ error: "Error al obtener perfil eliminado" });
        }
        res.json(results[0]); // 👈 Devuelve el perfil marcado como eliminado
      });
    }
  );
};

// ✅ Restaurar perfil (quita deleted_at)
exports.restoreProfile = (req, res) => {
  const userId = req.params.id;

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

      // 🔄 Devolver perfil restaurado
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
