const pool = require("../config/database");

const Producto = {
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE activo = TRUE ORDER BY created_at DESC"
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
    return rows[0];
  },

  getByCategory: async (categoryId) => {
    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE categoria_id = ? AND activo = TRUE",
      [categoryId]
    );
    return rows;
  },

  create: async (data) => {
    const { nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado } = data;
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado || false]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado, activo } = data;
    const [result] = await pool.query(
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, precio_anterior = ?, imagen = ?, categoria_id = ?, stock = ?, destacado = ?, activo = ? WHERE id = ?",
      [nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado, activo, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query("UPDATE productos SET activo = FALSE WHERE id = ?", [id]);
    return result.affectedRows;
  },

  getDestacados: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE destacado = TRUE AND activo = TRUE LIMIT 10"
    );
    return rows;
  },

  search: async (termino) => {
    const like = `%${termino}%`;
    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE activo = TRUE AND (nombre LIKE ? OR descripcion LIKE ?)",
      [like, like]
    );
    return rows;
  },
};

module.exports = Producto;
