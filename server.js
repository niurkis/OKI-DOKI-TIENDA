const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1. CARPETA PÚBLICA (Aquí es donde Express buscará /css/style.css)
app.use(express.static(path.join(__dirname, "public")));

// 2. RUTAS DE LAS VISTAS (Páginas principales)
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

// 3. RUTAS DE LA API
app.use("/api/productos", require("./routes/productos"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacto", require("./routes/contacto"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor Oki Doki funcionando en http://localhost:" + PORT);
});