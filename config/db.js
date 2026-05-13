const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "okidokibd",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: "Z"
});

pool.getConnection()
  .then(conn => {
    console.log("MySQL conectado");
    conn.release();
  })
  .catch(err => {
    console.log("Error MySQL:", err.message);
  });

module.exports = pool;
