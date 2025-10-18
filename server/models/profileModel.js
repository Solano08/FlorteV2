// server/models/profileModel.js
const db = require('../config/db');

exports.getProfileById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM usuarios WHERE id = ? AND deleted_at IS NULL', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

exports.updateProfile = (id, data) => {
  const { nombre_completo, correo, bio, github_url, linkedin_url, ubicacion, ocupacion } = data;
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE usuarios SET nombre_completo=?, correo=?, bio=?, github_url=?, linkedin_url=?, ubicacion=?, ocupacion=? WHERE id = ? AND deleted_at IS NULL`,
      [nombre_completo, correo, bio, github_url, linkedin_url, ubicacion, ocupacion, id],
      (err) => {
        if (err) return reject(err);
        db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err2, results) => {
          if (err2) return reject(err2);
          resolve(results[0]);
        });
      }
    );
  });
};
