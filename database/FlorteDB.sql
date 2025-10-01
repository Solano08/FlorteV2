CREATE DATABASE FlorteDB;
USE FlorteDB;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contraseña VARCHAR(64) NOT NULL, -- Guardar hash SHA2-256
  avatar_url VARCHAR(255),
  bio TEXT,
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  ubicacion VARCHAR(100),
  ocupacion VARCHAR(100),
  fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplo de inserción
INSERT INTO usuarios (nombre_completo, correo, contraseña, avatar_url, bio, github_url, linkedin_url, ubicacion, ocupacion)
VALUES (
  'David Esteban Solano',
  'david@example.com',
  SHA2('123456', 256),

  'Soy estudiante de desarrollo web, trabajando en Florte 🚀',
  'https://github.com/Solano08',
  'https://linkedin.com/in/solano08',
  'Bogotá, Colombia',
  'Desarrollador Full Stack'
);

SELECT * FROM usuarios;

ALTER TABLE usuarios ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;