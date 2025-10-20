const db = require("../config/db");

const PROJECT_STATES = new Set(["activo", "completado", "archivado"]);

const sanitizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

exports.createProject = async (req, res) => {
  const { titulo, descripcion, estado, usuarioId, rol } = req.body;

  if (!usuarioId || !titulo) {
    return res.status(400).json({ error: "Usuario y titulo son requeridos." });
  }

  const normalizedState = PROJECT_STATES.has(estado) ? estado : "activo";
  const normalizedTitle = sanitizeText(titulo);
  const normalizedDescription = sanitizeText(descripcion) || null;
  const normalizedRole = sanitizeText(rol) || "Lider";

  if (!normalizedTitle) {
    return res.status(400).json({ error: "El titulo no puede estar vacio." });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [createProjectResult] = await connection.execute(
      "INSERT INTO proyectos (titulo, descripcion, estado) VALUES (?, ?, ?)",
      [normalizedTitle, normalizedDescription, normalizedState]
    );

    const projectId = createProjectResult.insertId;

    await connection.execute(
      `
        INSERT INTO usuario_proyectos (usuario_id, proyecto_id, rol)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE rol = VALUES(rol)
      `,
      [usuarioId, projectId, normalizedRole]
    );

    await connection.commit();

    const [projectRows] = await db.execute(
      "SELECT id, titulo, descripcion, estado, fecha_creacion FROM proyectos WHERE id = ?",
      [projectId]
    );

    return res.status(201).json({ project: projectRows[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Error al crear proyecto:", error);
    return res.status(500).json({ error: "No se pudo crear el proyecto." });
  } finally {
    connection.release();
  }
};
