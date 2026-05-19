const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  try {
    console.log("🔍 Conectando a MySQL...");
    
    // Conectar sin especificar base de datos para crearla
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Conexión exitosa a MySQL");

    // Leer archivo database.sql
    const fs = require("fs");
    const sqlPath = "./database.sql";
    
    if (!fs.existsSync(sqlPath)) {
      console.error("❌ Archivo database.sql no encontrado");
      await connection.end();
      return;
    }

    const sql = fs.readFileSync(sqlPath, "utf8");
    
    // Ejecutar cada comando del SQL
    const commands = sql.split(";").filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          await connection.query(command);
          console.log("✓ Comando ejecutado:", command.substring(0, 50).trim() + "...");
        } catch (error) {
          console.error("❌ Error en comando:", error.message);
        }
      }
    }

    console.log("✅ Base de datos configurada exitosamente");
    await connection.end();
  } catch (error) {
    console.error("❌ Error al configurar base de datos:", error.message);
    process.exit(1);
  }
}

setupDatabase();
