const ProductoModel = require("../models/productoModel");

const ProductoController = {
  async obtenerTodos(req, res) {
    try {
      const productos = await ProductoModel.obtenerTodos();
      res.json({
        success: true,
        data: productos
      });
    } catch (error) {
      console.error("Error obtener productos:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error al obtener productos",
        error: error.message
      });
    }
  },

  async obtenerDestacados(req, res) {
    try {
      const productos = await ProductoModel.obtenerDestacados();
      res.json({
        success: true,
        data: productos
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
  }
};

module.exports = ProductoController;
