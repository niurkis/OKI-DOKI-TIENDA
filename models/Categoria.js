const pool = require("../config/database");

const Categoria = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categorias ORDER BY nombre");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { nombre, slug } = data;
    const [result] = await pool.query(
      "INSERT INTO categorias (nombre, slug) VALUES (?, ?)",
      [nombre, slug]
    );
    return result.insertId;
  },
};

module.exports = Categoria;
