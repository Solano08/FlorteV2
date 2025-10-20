CREATE DATABASE IF NOT EXISTS FlorteDB;
USE FlorteDB;

DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS reacciones_publicacion;
DROP TABLE IF EXISTS publicaciones;
DROP TABLE IF EXISTS usuario_cursos;
DROP TABLE IF EXISTS usuario_proyectos;
DROP TABLE IF EXISTS seguidores;
DROP TABLE IF EXISTS hashtags;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS proyectos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  password_bcrypt CHAR(64) NOT NULL,
  avatar_url VARCHAR(255),
  portada_url VARCHAR(255),
  bio TEXT,
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  ubicacion VARCHAR(100),
  ocupacion VARCHAR(100),
  rol ENUM('aprendiz', 'instructor', 'admin') DEFAULT 'aprendiz',
  fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE proyectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  estado ENUM('activo', 'completado', 'archivado') DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuario_proyectos (
  usuario_id INT NOT NULL,
  proyecto_id INT NOT NULL,
  rol VARCHAR(100) DEFAULT 'Colaborador',
  fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, proyecto_id),
  CONSTRAINT fk_usuario_proyectos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_proyectos_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  proveedor VARCHAR(150),
  fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuario_cursos (
  usuario_id INT NOT NULL,
  curso_id INT NOT NULL,
  completado TINYINT(1) DEFAULT 0,
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, curso_id),
  CONSTRAINT fk_usuario_cursos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_cursos_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE seguidores (
  seguidor_id INT NOT NULL,
  seguido_id INT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (seguidor_id, seguido_id),
  CONSTRAINT fk_seguidor FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_seguido FOREIGN KEY (seguido_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hashtags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag VARCHAR(100) NOT NULL UNIQUE,
  posts INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE publicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  proyecto_id INT NULL,
  contenido TEXT,
  tipo ENUM('texto', 'imagen', 'video') DEFAULT 'texto',
  media_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_publicacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_publicacion_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reacciones_publicacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  publicacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  tipo ENUM('me_gusta', 'apoyo', 'divertido', 'triste', 'enojado') NOT NULL DEFAULT 'me_gusta',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_reaccion (publicacion_id, usuario_id),
  CONSTRAINT fk_reaccion_publicacion FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
  CONSTRAINT fk_reaccion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  publicacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  contenido TEXT,
  media_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comentario_publicacion FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
  CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO usuarios (nombre_completo, correo, password_bcrypt, avatar_url, portada_url, bio, github_url, linkedin_url, ubicacion, ocupacion, rol, ultima_conexion)
VALUES
  ('David Esteban Solano', 'david@example.com', '$2a$10$19BUe4v.a1CW4k4EVWUjOuZdOJs0f.O9S3t/4qL1BgfZHNU8ZeXvy', NULL, NULL, 'Estudiante de desarrollo web, trabajando en Florte', 'https://github.com/Solano08', 'https://linkedin.com/in/solano08', 'Bogota, Colombia', 'Desarrollador Full Stack', 'aprendiz', CURRENT_TIMESTAMP),
  ('Laura Martinez', 'laura@example.com', '$2a$10$19BUe4v.a1CW4k4EVWUjOuZdOJs0f.O9S3t/4qL1BgfZHNU8ZeXvy', NULL, NULL, 'Disenadora enfocada en experiencias simples', 'https://github.com/lauradev', 'https://linkedin.com/in/lauradev', 'Medellin, Colombia', 'Disenadora UX', 'aprendiz', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 HOUR)),
  ('Carlos Ruiz', 'carlos@example.com', '$2a$10$19BUe4v.a1CW4k4EVWUjOuZdOJs0f.O9S3t/4qL1BgfZHNU8ZeXvy', NULL, NULL, 'Desarrollador backend apasionado por Node.js', 'https://github.com/carlosruiz', 'https://linkedin.com/in/carlosruiz', 'Cali, Colombia', 'Desarrollador Backend', 'aprendiz', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
  ('Ana Torres', 'ana@example.com', '$2a$10$19BUe4v.a1CW4k4EVWUjOuZdOJs0f.O9S3t/4qL1BgfZHNU8ZeXvy', NULL, NULL, 'Instructora SENA en analisis de datos', 'https://github.com/anatorres', 'https://linkedin.com/in/anatorres', 'Bogota, Colombia', 'Instructora de Datos', 'instructor', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE));

INSERT INTO proyectos (titulo, descripcion, estado)
VALUES
  ('Plataforma de seguimiento', 'Aplicacion para seguimiento de proyectos formativos', 'activo'),
  ('Panel de analitica', 'Dashboard para visualizar el progreso de aprendices', 'activo'),
  ('Repositorio de recursos', 'Coleccion de recursos tecnicos para aprendices', 'completado');

INSERT INTO usuario_proyectos (usuario_id, proyecto_id, rol)
VALUES
  (1, 1, 'Lider'),
  (1, 2, 'Colaborador'),
  (2, 1, 'Disenadora'),
  (2, 3, 'Colaboradora'),
  (3, 2, 'Backend'),
  (4, 3, 'Mentora');

INSERT INTO cursos (nombre, proveedor)
VALUES
  ('React desde cero', 'SENA'),
  ('Fundamentos de bases de datos', 'SENA'),
  ('Gestion de proyectos agiles', 'Coursera');

INSERT INTO usuario_cursos (usuario_id, curso_id, completado)
VALUES
  (1, 1, 1),
  (1, 2, 1),
  (1, 3, 0),
  (2, 1, 1),
  (3, 2, 0),
  (4, 3, 1);

INSERT INTO seguidores (seguidor_id, seguido_id)
VALUES
  (1, 2),
  (2, 1),
  (1, 3),
  (3, 1),
  (1, 4),
  (2, 3);

INSERT INTO hashtags (tag, posts)
VALUES
  ('#Florte', 125),
  ('#ReactJS', 98),
  ('#NodeJS', 74),
  ('#AprendizSENA', 65),
  ('#JobsToBeDone', 41),
  ('#AnaliticaDeDatos', 33),
  ('#UIUX', 29);

INSERT INTO publicaciones (usuario_id, proyecto_id, contenido, tipo, media_url)
VALUES
  (1, 1, 'Comenzamos la fase de diseno del tablero principal.', 'texto', NULL),
  (2, 1, 'Mockups actualizados disponibles para retroalimentacion.', 'imagen', '/uploads/mockup-proyecto1.png'),
  (3, 2, 'Se completo la integracion con la API de reportes.', 'texto', NULL),
  (1, NULL, 'Poseemos un nuevo video tutorial sobre consultas SQL.', 'video', '/uploads/tutorial-sql.mp4');

INSERT INTO reacciones_publicacion (publicacion_id, usuario_id, tipo)
VALUES
  (1, 2, 'apoyo'),
  (1, 3, 'me_gusta'),
  (2, 1, 'me_gusta'),
  (3, 1, 'divertido'),
  (4, 2, 'me_gusta');

INSERT INTO comentarios (publicacion_id, usuario_id, contenido, media_url)
VALUES
  (1, 2, 'Excelente avance, revisare la documentacion.', NULL),
  (2, 4, 'Comparto la version con correcciones de color.', '/uploads/mockup-correcciones.png'),
  (3, 1, 'Buen trabajo equipo!', NULL),
  (4, 3, 'El video esta muy claro, gracias.', NULL);
