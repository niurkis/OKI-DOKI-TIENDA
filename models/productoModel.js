const db = require("../config/db");

const ProductoModel = {
  async obtenerTodos() {
    const [rows] = await db.execute(
      "SELECT p.*, c.nombre as categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.activo = 1 ORDER BY p.created_at DESC"
    );
    return rows;
  },

  async obtenerDestacados() {
    const [rows] = await db.execute(
      "SELECT p.*, c.nombre as categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.activo = 1 AND p.destacado = 1 ORDER BY p.created_at DESC"
    );
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await db.execute(
      "SELECT p.*, c.nombre as categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ? AND p.activo = 1",
      [id]
    );
    return rows[0] || null;
  },

  async obtenerPorCategoria(categoriaId) {
    const [rows] = await db.execute(
      "SELECT p.*, c.nombre as categoria FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.categoria_id = ? AND p.activo = 1 ORDER BY p.created_at DESC",
      [categoriaId]
    );
    return rows;
  }
};

module.exports = ProductoModel;
