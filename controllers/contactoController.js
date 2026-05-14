const db = require("../config/db");
const validator = require("validator");

const ContactoController = {
  async enviar(req, res) {
    try {
      const { nombre, correo, telefono, asunto, mensaje } = req.body;

      if (!nombre || !correo || !mensaje) {
        return res.status(400).json({
          success: false,
          mensaje: "Nombre, correo y mensaje son requeridos"
        });
      }

      if (!validator.isEmail(correo)) {
        return res.status(400).json({
          success: false,
          mensaje: "Correo inválido"
        });
      }

      if (nombre.length > 100 || nombre.length < 2) {
        return res.status(400).json({
          success: false,
          mensaje: "Nombre debe tener entre 2 y 100 caracteres"
        });
      }

      if (mensaje.length > 1000 || mensaje.length < 5) {
        return res.status(400).json({
          success: false,
          mensaje: "Mensaje debe tener entre 5 y 1000 caracteres"
        });
      }

      const [result] = await db.execute(
        "INSERT INTO contactos (nombre, correo, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)",
        [
          validator.trim(nombre),
          validator.normalizeEmail(correo),
          telefono ? validator.trim(telefono) : null,
          asunto ? validator.trim(asunto) : null,
          validator.trim(mensaje)
        ]
      );

      res.status(201).json({
        success: true,
        mensaje: "Mensaje enviado correctamente. Te responderemos pronto.",
        id: result.insertId
      });

    } catch (error) {
      console.error("Error contacto:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error al enviar mensaje. Intenta de nuevo más tarde."
      });
    }
  }
};

module.exports = ContactoController;
