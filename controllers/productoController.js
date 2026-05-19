const Producto = require("../models/Producto");

const ProductoController = {
  async obtenerTodos(req, res) {
    try {
      const productos = await Producto.getAll();
      res.json({ success: true, data: productos });
    } catch (error) {
      console.error("Error obtener productos:", error);
      res.status(500).json({ success: false, mensaje: "Error al obtener productos", error: error.message });
    }
  },

  async obtenerDestacados(req, res) {
    try {
      const productos = await Producto.getDestacados();
      res.json({ success: true, data: productos });
    } catch (error) {
      console.error("Error obtener destacados:", error);
      res.status(500).json({ success: false, mensaje: "Error al obtener productos destacados" });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const producto = await Producto.getById(id);
      
      if (!producto) {
        return res.status(404).json({ success: false, mensaje: "Producto no encontrado" });
      }

      res.json({ success: true, data: producto });
    } catch (error) {
      console.error("Error obtener producto:", error);
      res.status(500).json({ success: false, mensaje: "Error al obtener producto" });
    }
  },

  async crearProducto(req, res) {
    try {
      const { nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado } = req.body;

      if (!nombre || !precio) {
        return res.status(400).json({ success: false, mensaje: "El nombre y precio son requeridos" });
      }

      const id = await Producto.create({
        nombre,
        descripcion,
        precio,
        precio_anterior,
        imagen,
        categoria_id,
        stock: stock || 0,
        destacado: destacado || false,
      });

      res.status(201).json({ success: true, mensaje: "Producto creado exitosamente", id });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({ success: false, mensaje: error.message });
    }
  },

  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado, activo } = req.body;

      if (!nombre || !precio) {
        return res.status(400).json({ success: false, mensaje: "El nombre y precio son requeridos" });
      }

      const affectedRows = await Producto.update(id, {
        nombre, descripcion, precio, precio_anterior, imagen, categoria_id, stock, destacado, activo
      });

      if (affectedRows === 0) {
        return res.status(404).json({ success: false, mensaje: "Producto no encontrado" });
      }

      res.json({ success: true, mensaje: "Producto actualizado exitosamente" });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ success: false, mensaje: error.message });
    }
  },

  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const affectedRows = await Producto.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({ success: false, mensaje: "Producto no encontrado" });
      }

      res.json({ success: true, mensaje: "Producto eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ success: false, mensaje: error.message });
    }
  }
};

module.exports = ProductoController;
