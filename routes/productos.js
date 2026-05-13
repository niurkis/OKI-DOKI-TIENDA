const express = require("express");
const router = express.Router();

const ProductoController = require("../controllers/productoController");

router.get("/", ProductoController.obtenerTodos);
router.get("/destacados", ProductoController.obtenerDestacados);
router.get("/:id", ProductoController.obtenerPorId);

module.exports = router;
