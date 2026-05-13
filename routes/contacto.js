const express = require("express");
const router = express.Router();

const ContactoController = require("../controllers/contactoController");

router.post("/", ContactoController.enviar);

module.exports = router;
