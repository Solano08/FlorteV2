const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "FlorteDB",
  port: Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("[DB] Conectado a la base de datos MySQL");
    connection.release();
  } catch (error) {
    console.error("[DB] Error de conexion a la base de datos:", error.message);
  }
})();

module.exports = pool;
