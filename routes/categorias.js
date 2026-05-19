const express = require("express");
const router = express.Router();
const Categoria = require("../models/Categoria");

// GET: Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.getAll();
    res.json({ success: true, data: categorias });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ success: false, mensaje: error.message });
  }
});

module.exports = router;
