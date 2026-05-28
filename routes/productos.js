const express = require("express");
const router = express.Router();

const ProductoController = require("../controllers/productoController");

// GET: Obtener todos los productos
router.get("/", ProductoController.obtenerTodos);

// GET: Buscar productos (debe ir antes de /:id)
router.get("/buscar", ProductoController.buscarProductos);

// GET: Obtener productos destacados
router.get("/destacados", ProductoController.obtenerDestacados);

// POST: Crear nuevo producto
router.post("/", ProductoController.crearProducto);

// GET: Obtener producto por ID (debe ir después de las rutas específicas)
router.get("/:id", ProductoController.obtenerPorId);

// PUT: Actualizar producto
router.put("/:id", ProductoController.actualizarProducto);

// DELETE: Eliminar producto
router.delete("/:id", ProductoController.eliminarProducto);

module.exports = router;
