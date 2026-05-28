const db = require("../config/database");

const ContactoController = {
  async enviar(req, res) {
    try {
      const { nombre, correo, telefono, mensaje } = req.body;

      if (!nombre || !correo || !mensaje) {
        return res.status(400).json({
          success: false,
          mensaje: "Nombre, correo y mensaje son requeridos"
        });
      }

      const [result] = await db.execute(
        "INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)",
        [nombre, correo, telefono || null, mensaje]
      );

      res.status(201).json({
        success: true,
        mensaje: "Mensaje enviado correctamente",
        id: result.insertId
      });

    } catch (error) {
      console.error("Error contacto:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error al enviar mensaje"
      });
    }
  }
};

module.exports = ContactoController;
