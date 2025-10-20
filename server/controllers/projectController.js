const db = require("../config/db");

const PROJECT_STATES = new Set(["activo", "completado", "archivado"]);

const sanitizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const parsePositiveInt = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

exports.listByUser = async (req, res) => {
  const userId = parsePositiveInt(req.query.usuarioId);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

  try {
    const [rows] = await db.execute(
      `
        SELECT
          p.id,
          p.titulo,
          p.descripcion,
          p.estado,
          p.fecha_creacion,
          up.rol,
          (
            SELECT COUNT(*) FROM publicaciones pub WHERE pub.proyecto_id = p.id
          ) AS posts_count
        FROM proyectos p
        INNER JOIN usuario_proyectos up ON up.proyecto_id = p.id
        WHERE up.usuario_id = ?
        ORDER BY p.fecha_creacion DESC
      `,
      [userId]
    );

    return res.json({ projects: rows });
  } catch (error) {
    console.error("Error al listar proyectos:", error);
    return res.status(500).json({ error: "No se pudieron obtener los proyectos." });
  }
};

exports.getProject = async (req, res) => {
  const projectId = parsePositiveInt(req.params.id);
  const userId = parsePositiveInt(req.query.usuarioId);

  if (!projectId) {
    return res.status(400).json({ error: "Identificador de proyecto no valido." });
  }

  try {
    const [projectRows] = await db.execute(
      `
        SELECT
          p.id,
          p.titulo,
          p.descripcion,
          p.estado,
          p.fecha_creacion
        FROM proyectos p
        WHERE p.id = ?
      `,
      [projectId]
    );

    if (projectRows.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado." });
    }

    const project = projectRows[0];

    const [[postsStats]] = await db.execute(
      "SELECT COUNT(*) AS total FROM publicaciones WHERE proyecto_id = ?",
      [projectId]
    );

    const [members] = await db.execute(
      `
        SELECT
          u.id,
          u.nombre_completo,
          u.avatar_url,
          up.rol
        FROM usuario_proyectos up
        INNER JOIN usuarios u ON u.id = up.usuario_id
        WHERE up.proyecto_id = ?
        ORDER BY u.nombre_completo ASC
      `,
      [projectId]
    );

    let membership = null;

    if (userId) {
      const [membershipRows] = await db.execute(
        `
          SELECT rol
          FROM usuario_proyectos
          WHERE usuario_id = ? AND proyecto_id = ?
        `,
        [userId, projectId]
      );

      membership = membershipRows[0]?.rol ?? null;
    }

    return res.json({
      project: {
        ...project,
        posts_count: postsStats?.total ?? 0,
        members,
        membership,
      },
    });
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    return res.status(500).json({ error: "No se pudo cargar el proyecto." });
  }
};

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
      `
        SELECT
          p.id,
          p.titulo,
          p.descripcion,
          p.estado,
          p.fecha_creacion,
          ? AS rol
        FROM proyectos p
        WHERE p.id = ?
      `,
      [normalizedRole, projectId]
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
