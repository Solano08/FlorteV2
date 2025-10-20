const db = require("../config/db");

const ONLINE_THRESHOLD_MINUTES = 5;

const parseUserId = (rawValue) => {
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

exports.getOverview = async (req, res) => {
  const userId = parseUserId(req.params.userId);

  if (!userId) {
    return res.status(400).json({ error: "Identificador de usuario no valido." });
  }

  try {
    const projectCountPromise = db.execute(
      "SELECT COUNT(*) AS total FROM usuario_proyectos WHERE usuario_id = ?",
      [userId]
    );

    const connectionCountPromise = db.execute(
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

    const courseCountPromise = db.execute(
      "SELECT COUNT(*) AS total FROM usuario_cursos WHERE usuario_id = ?",
      [userId]
    );

    const trendsPromise = db.execute(
      "SELECT tag, posts FROM hashtags ORDER BY posts DESC, id ASC LIMIT 5"
    );

    const suggestionsPromise = db.execute(
      `
        SELECT u.id, u.nombre_completo, u.ocupacion
        FROM usuarios u
        WHERE u.id <> ?
          AND u.deleted_at IS NULL
          AND u.id NOT IN (
            SELECT seguido_id FROM seguidores WHERE seguidor_id = ?
          )
        ORDER BY u.fecha_union DESC
        LIMIT 5
      `,
      [userId, userId]
    );

    const mutualConnectionsPromise = db.execute(
      `
        SELECT u.id, u.nombre_completo, u.ocupacion, u.ultima_conexion
        FROM usuarios u
        INNER JOIN seguidores s1 ON s1.seguidor_id = ? AND s1.seguido_id = u.id
        INNER JOIN seguidores s2 ON s2.seguidor_id = u.id AND s2.seguido_id = ?
        WHERE u.deleted_at IS NULL
        ORDER BY u.nombre_completo ASC
      `,
      [userId, userId]
    );

    const [
      [projectCountRows],
      [connectionCountRows],
      [courseCountRows],
      [trendRows],
      [suggestionRows],
      [mutualRows],
    ] = await Promise.all([
      projectCountPromise,
      connectionCountPromise,
      courseCountPromise,
      trendsPromise,
      suggestionsPromise,
      mutualConnectionsPromise,
    ]);

    const now = Date.now();
    const onlineWindowMs = ONLINE_THRESHOLD_MINUTES * 60 * 1000;

    const stats = {
      projects: projectCountRows[0]?.total ?? 0,
      connections: connectionCountRows[0]?.total ?? 0,
      courses: courseCountRows[0]?.total ?? 0,
    };

    const trends = trendRows.map((row) => ({
      tag: row.tag,
      posts: row.posts,
    }));

    const suggestions = suggestionRows.map((row) => ({
      id: row.id,
      name: row.nombre_completo,
      role: row.ocupacion ?? "Aprendiz",
    }));

    const mutualConnections = mutualRows.map((row) => {
      const lastSeen = row.ultima_conexion ? new Date(row.ultima_conexion).getTime() : null;
      const isOnline = lastSeen ? now - lastSeen <= onlineWindowMs : false;

      return {
        id: row.id,
        name: row.nombre_completo,
        role: row.ocupacion ?? "Aprendiz",
        isOnline,
      };
    });

    return res.json({
      stats,
      trends,
      suggestions,
      mutualConnections,
    });
  } catch (error) {
    console.error("Error al obtener datos del tablero:", error);
    return res.status(500).json({ error: "No se pudo cargar la informacion del inicio." });
  }
};
