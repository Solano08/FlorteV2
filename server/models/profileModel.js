import { db } from "./db.js";

export const getProfileById = async (id) => {
  const [rows] = await db.query("SELECT * FROM perfiles WHERE id = ?", [id]);
  return rows[0];
};

export const updateProfile = async (id, data) => {
  const { nombre, correo, bio, ubicacion, ocupacion } = data;
  await db.query(
    `UPDATE perfiles 
     SET nombre_completo = ?, bio = ?, ubicacion = ?, ocupacion = ? 
     WHERE id = ?`,
    [nombre, bio, ubicacion, ocupacion, id]
  );
  // también puedes actualizar correo en la tabla usuarios
  await db.query("UPDATE usuarios SET correo = ? WHERE id = ?", [correo, id]);

  return getProfileById(id);
};
