const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Carpeta pública
app.use(express.static(path.join(__dirname, "public")));

// Rutas de vistas (páginas HTML)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/carrito", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "carrito.html"));
});

app.get("/nosotros", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "nosotros.html"));
});

app.get("/contacto", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contacto.html"));
});

app.get("/producto/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "producto.html"));
});

// Rutas API
app.use("/api/productos", require("./routes/productos"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacto", require("./routes/contacto"));

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ success: false, mensaje: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor Oki Doki funcionando en http://localhost:${PORT}\n`);
});