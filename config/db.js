require('dotenv').config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "okidokibd",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: "Z"
});

pool.getConnection()
  .then(conn => {
    console.log("✓ MySQL conectado correctamente");
    conn.release();
  })
  .catch(err => {
    console.error("✗ Error MySQL:", err.message);
    console.error("Verifica la configuración en .env");
  });

module.exports = pool;
