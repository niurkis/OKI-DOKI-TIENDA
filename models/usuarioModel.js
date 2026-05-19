const db = require("../config/db");

const UsuarioModel = {
  async obtenerPorCredenciales(correo, password) {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE correo = ? AND password = ?",
      [correo, password]
    );
    return rows[0] || null;
  },

  async obtenerPorCorreo(correo) {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );
    return rows[0] || null;
  },

  async crear({ nombre, correo, password, rol = "cliente" }) {
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, correo, password, rol]
    );
    return { id: result.insertId, nombre, correo, rol };
  }
};

module.exports = UsuarioModel;
