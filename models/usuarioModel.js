const bcrypt = require("bcrypt");
const db = require("../config/db");

const UsuarioModel = {
  async obtenerPorCorreo(correo) {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );
    return rows[0] || null;
  },

  async obtenerPorId(id) {
    const [rows] = await db.execute(
      "SELECT id, nombre, correo, rol, created_at FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async crearUsuario(nombre, correo, password, rol = 'cliente') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, correo, hashedPassword, rol]
    );
    return result.insertId;
  },

  async verificarCredenciales(correo, password) {
    const usuario = await this.obtenerPorCorreo(correo);
    if (!usuario) {
      return null;
    }
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return null;
    }
    return usuario;
  }
};

module.exports = UsuarioModel;
