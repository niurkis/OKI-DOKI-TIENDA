const ProductoModel = require("../models/productoModel");

const ProductoController = {
  async obtenerTodos(req, res) {
    try {
      const productos = await ProductoModel.obtenerTodos();
      res.json({
        success: true,
        data: productos,
        total: productos.length
      });
    } catch (error) {
      console.error("Error obtener productos:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error al obtener productos",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async obtenerDestacados(req, res) {
    try {
      const productos = await ProductoModel.obtenerDestacados();
      res.json({
        success: true,
        data: productos,
        total: productos.length
      });
    } catch (error) {
      console.error("Error obtener destacados:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error al obtener productos destacados"
      });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      if (!Number.isInteger(parseInt(id)) || parseInt(id) <= 0) {
        return res.status(400).json({
          success: false,
          mensaje: "ID de producto inválido"
        });
      }

      const producto = await ProductoModel.obtenerPorId(id);

      if (!producto) {
        return res.status(404).json({
          success: false,
          mensaje: "Producto no encontrado"
        });
      }

      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      console.error("Error obtener producto:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error al obtener producto"
      });
    }
  },

  async obtenerPorCategoria(req, res) {
    try {
      const { categoriaId } = req.params;

      if (!Number.isInteger(parseInt(categoriaId)) || parseInt(categoriaId) <= 0) {
        return res.status(400).json({
          success: false,
          mensaje: "ID de categoría inválido"
        });
      }

      const productos = await ProductoModel.obtenerPorCategoria(categoriaId);
      res.json({
        success: true,
        data: productos,
        total: productos.length
      });
    } catch (error) {
      console.error("Error obtener por categoría:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error al obtener productos por categoría"
      });
    }
  }
};

module.exports = ProductoController;
