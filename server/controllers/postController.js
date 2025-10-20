const db = require("../config/db");
const { buildPublicPath } = require("../utils/fileStorage");
const { parsePositiveInt } = require("../utils/validation");

const REACTION_TYPES = new Set(["me_gusta", "apoyo", "divertido", "triste", "enojado"]);

const formatReactionTotals = (rows) => {
  const totals = {};
  let totalCount = 0;

  rows.forEach((row) => {
    totals[row.tipo] = row.total;
    totalCount += row.total;
  });

  return { totals, totalCount };
};

exports.listFeed = async (req, res) => {
  const userId = parsePositiveInt(req.query.userId);
  const projectId = parsePositiveInt(req.query.projectId);

  try {
    const filters = [];
    const params = [];

    if (projectId) {
      filters.push("p.proyecto_id = ?");
      params.push(projectId);
    } else if (userId) {
      filters.push(
        "(p.proyecto_id IS NULL OR p.proyecto_id IN (SELECT proyecto_id FROM usuario_proyectos WHERE usuario_id = ?))"
      );
      params.push(userId);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const [posts] = await db.execute(
      `
        SELECT
          p.id,
          p.usuario_id,
          p.proyecto_id,
          p.contenido,
          p.tipo,
          p.media_url,
          p.created_at,
          u.nombre_completo AS autor_nombre,
          u.avatar_url AS autor_avatar,
          pr.titulo AS proyecto_titulo
        FROM publicaciones p
        INNER JOIN usuarios u ON u.id = p.usuario_id
        LEFT JOIN proyectos pr ON pr.id = p.proyecto_id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT 25
      `,
      params
    );

    if (posts.length === 0) {
      return res.json({ posts: [] });
    }

    const postIds = posts.map((post) => post.id);
    const placeholders = postIds.map(() => "?").join(",");

    // 🔹 Obtener totales de reacciones
    const [reactionTotals] = await db.execute(
      `
        SELECT publicacion_id, tipo, COUNT(*) AS total
        FROM reacciones_publicacion
        WHERE publicacion_id IN (${placeholders})
        GROUP BY publicacion_id, tipo
      `,
      postIds
    );

    // 🔹 Obtener reacciones del usuario (si hay userId)
    let userReactions = [];
    if (userId) {
      [userReactions] = await db.execute(
        `
          SELECT publicacion_id, tipo
          FROM reacciones_publicacion
          WHERE usuario_id = ? AND publicacion_id IN (${placeholders})
        `,
        [userId, ...postIds]
      );
    }

    // 🔹 Obtener conteo de comentarios
    const [commentCounts] = await db.execute(
      `
        SELECT publicacion_id, COUNT(*) AS total
        FROM comentarios
        WHERE publicacion_id IN (${placeholders})
        GROUP BY publicacion_id
      `,
      postIds
    );

    // 🔹 Organizar resultados
    const reactionByPost = reactionTotals.reduce((acc, row) => {
      if (!acc[row.publicacion_id]) {
        acc[row.publicacion_id] = [];
      }
      acc[row.publicacion_id].push(row);
      return acc;
    }, {});

    const userReactionByPost = userReactions.reduce((acc, row) => {
      acc[row.publicacion_id] = row.tipo;
      return acc;
    }, {});

    const commentCountByPost = commentCounts.reduce((acc, row) => {
      acc[row.publicacion_id] = row.total;
      return acc;
    }, {});

    // 🔹 Formatear publicaciones finales
    const formattedPosts = posts.map((post) => {
      const reactions = formatReactionTotals(reactionByPost[post.id] ?? []);
      return {
        id: post.id,
        content: post.contenido,
        type: post.tipo,
        mediaUrl: post.media_url,
        createdAt: post.created_at,
        project: post.proyecto_id
          ? { id: post.proyecto_id, title: post.proyecto_titulo }
          : null,
        author: {
          id: post.usuario_id,
          name: post.autor_nombre,
          avatarUrl: post.autor_avatar,
        },
        reactions: {
          totals: reactions.totals,
          totalCount: reactions.totalCount,
          userReaction: userReactionByPost[post.id] ?? null,
        },
        comments: {
          totalCount: commentCountByPost[post.id] ?? 0,
        },
      };
    });

    return res.json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error al listar publicaciones:", error);
    return res.status(500).json({ error: "No se pudo cargar el feed." });
  }
};

exports.createPost = async (req, res) => {
  const userId = parsePositiveInt(req.body.usuarioId);
  const projectId = parsePositiveInt(req.body.proyectoId);
  const content = typeof req.body.contenido === "string" ? req.body.contenido.trim() : "";
  const type = typeof req.body.tipo === "string" ? req.body.tipo.trim() : "texto";

  if (!userId) {
    return res.status(400).json({ error: "Usuario no válido." });
  }

  if (!content && !req.file) {
    return res.status(400).json({ error: "La publicación debe tener texto o archivo adjunto." });
  }

  const allowedTypes = new Set(["texto", "imagen", "video"]);
  const postType = allowedTypes.has(type) ? type : req.file ? "imagen" : "texto";

  try {
    if (projectId) {
      const [membershipRows] = await db.execute(
        "SELECT 1 FROM usuario_proyectos WHERE usuario_id = ? AND proyecto_id = ?",
        [userId, projectId]
      );

      if (membershipRows.length === 0) {
        return res.status(403).json({ error: "No eres miembro de este proyecto." });
      }
    }

    const mediaUrl = req.file ? buildPublicPath(req.file.filename) : null;

    const [result] = await db.execute(
      `
        INSERT INTO publicaciones (usuario_id, proyecto_id, contenido, tipo, media_url)
        VALUES (?, ?, ?, ?, ?)
      `,
      [userId, projectId, content || null, postType, mediaUrl]
    );

    const [rows] = await db.execute(
      `
        SELECT
          p.id,
          p.usuario_id,
          p.proyecto_id,
          p.contenido,
          p.tipo,
          p.media_url,
          p.created_at,
          u.nombre_completo AS autor_nombre,
          u.avatar_url AS autor_avatar,
          pr.titulo AS proyecto_titulo
        FROM publicaciones p
        INNER JOIN usuarios u ON u.id = p.usuario_id
        LEFT JOIN proyectos pr ON pr.id = p.proyecto_id
        WHERE p.id = ?
      `,
      [result.insertId]
    );

    const post = rows[0];

    return res.status(201).json({
      post: {
        id: post.id,
        content: post.contenido,
        type: post.tipo,
        mediaUrl: post.media_url,
        createdAt: post.created_at,
        project: post.proyecto_id ? { id: post.proyecto_id, title: post.proyecto_titulo } : null,
        author: {
          id: post.usuario_id,
          name: post.autor_nombre,
          avatarUrl: post.autor_avatar,
        },
        reactions: {
          totals: {},
          totalCount: 0,
          userReaction: null,
        },
        comments: {
          totalCount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error al crear publicación:", error);
    return res.status(500).json({ error: "No se pudo crear la publicación." });
  }
};

exports.reactToPost = async (req, res) => {
  const userId = parsePositiveInt(req.body.usuarioId);
  const postId = parsePositiveInt(req.params.id);
  const reactionType = typeof req.body.tipo === "string" ? req.body.tipo.trim() : "";

  if (!userId || !postId) {
    return res.status(400).json({ error: "Datos incompletos para reaccionar." });
  }

  if (!REACTION_TYPES.has(reactionType)) {
    return res.status(400).json({ error: "Tipo de reacción no válido." });
  }

  try {
    const [existingRows] = await db.execute(
      `
        SELECT id, tipo
        FROM reacciones_publicacion
        WHERE publicacion_id = ? AND usuario_id = ?
      `,
      [postId, userId]
    );

    if (existingRows.length > 0) {
      const existing = existingRows[0];

      if (existing.tipo === reactionType) {
        await db.execute("DELETE FROM reacciones_publicacion WHERE id = ?", [existing.id]);
      } else {
        await db.execute(
          "UPDATE reacciones_publicacion SET tipo = ?, created_at = NOW() WHERE id = ?",
          [reactionType, existing.id]
        );
      }
    } else {
      await db.execute(
        `
          INSERT INTO reacciones_publicacion (publicacion_id, usuario_id, tipo)
          VALUES (?, ?, ?)
        `,
        [postId, userId, reactionType]
      );
    }

    const [reactionTotals] = await db.execute(
      `
        SELECT tipo, COUNT(*) AS total
        FROM reacciones_publicacion
        WHERE publicacion_id = ?
        GROUP BY tipo
      `,
      [postId]
    );

    const reactions = formatReactionTotals(reactionTotals);

    const [userReactionRow] = await db.execute(
      `
        SELECT tipo
        FROM reacciones_publicacion
        WHERE publicacion_id = ? AND usuario_id = ?
      `,
      [postId, userId]
    );

    return res.json({
      reactions: {
        totals: reactions.totals,
        totalCount: reactions.totalCount,
        userReaction: userReactionRow[0]?.tipo ?? null,
      },
    });
  } catch (error) {
    console.error("Error al reaccionar a la publicación:", error);
    return res.status(500).json({ error: "No se pudo registrar la reacción." });
  }
};

exports.addComment = async (req, res) => {
  const userId = parsePositiveInt(req.body.usuarioId);
  const postId = parsePositiveInt(req.params.id);
  const content = typeof req.body.contenido === "string" ? req.body.contenido.trim() : "";

  if (!userId || !postId) {
    return res.status(400).json({ error: "Datos incompletos para comentar." });
  }

  if (!content && !req.file) {
    return res.status(400).json({ error: "El comentario debe incluir texto o archivo." });
  }

  try {
    const [postRows] = await db.execute("SELECT id FROM publicaciones WHERE id = ?", [postId]);

    if (postRows.length === 0) {
      return res.status(404).json({ error: "Publicación no encontrada." });
    }

    const mediaUrl = req.file ? buildPublicPath(req.file.filename) : null;

    const [result] = await db.execute(
      `
        INSERT INTO comentarios (publicacion_id, usuario_id, contenido, media_url)
        VALUES (?, ?, ?, ?)
      `,
      [postId, userId, content || null, mediaUrl]
    );

    const [rows] = await db.execute(
      `
        SELECT
          c.id,
          c.publicacion_id,
          c.contenido,
          c.media_url,
          c.created_at,
          u.id AS usuario_id,
          u.nombre_completo,
          u.avatar_url
        FROM comentarios c
        INNER JOIN usuarios u ON u.id = c.usuario_id
        WHERE c.id = ?
      `,
      [result.insertId]
    );

    const [[commentCount]] = await db.execute(
      `
        SELECT COUNT(*) AS total
        FROM comentarios
        WHERE publicacion_id = ?
      `,
      [postId]
    );

    return res.status(201).json({
      comment: {
        id: rows[0].id,
        content: rows[0].contenido,
        mediaUrl: rows[0].media_url,
        createdAt: rows[0].created_at,
        author: {
          id: rows[0].usuario_id,
          name: rows[0].nombre_completo,
          avatarUrl: rows[0].avatar_url,
        },
      },
      totalCount: commentCount?.total ?? 0,
    });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    return res.status(500).json({ error: "No se pudo agregar el comentario." });
  }
};

exports.getComments = async (req, res) => {
  const postId = parsePositiveInt(req.params.id);

  if (!postId) {
    return res.status(400).json({ error: "Identificador de publicación no válido." });
  }

  try {
    const [rows] = await db.execute(
      `
        SELECT
          c.id,
          c.contenido,
          c.media_url,
          c.created_at,
          u.id AS usuario_id,
          u.nombre_completo,
          u.avatar_url
        FROM comentarios c
        INNER JOIN usuarios u ON u.id = c.usuario_id
        WHERE c.publicacion_id = ?
        ORDER BY c.created_at ASC
      `,
      [postId]
    );

    const comments = rows.map((row) => ({
      id: row.id,
      content: row.contenido,
      mediaUrl: row.media_url,
      createdAt: row.created_at,
      author: {
        id: row.usuario_id,
        name: row.nombre_completo,
        avatarUrl: row.avatar_url,
      },
    }));

    return res.json({ comments });
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return res.status(500).json({ error: "No se pudieron cargar los comentarios." });
  }
};
