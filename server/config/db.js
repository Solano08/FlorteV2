// server/config/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // ⚡ cambia si tu usuario es otro
  password: "",       // ⚡ pon la clave de MySQL si tienes
  database: "FlorteDB",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión:", err);
    return;
  }
  console.log("✅ Conectado a la BD MySQL");
});

module.exports = db;
