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
  }
};

module.exports = UsuarioModel;
