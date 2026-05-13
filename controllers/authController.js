const UsuarioModel = require("../models/usuarioModel");

const AuthController = {
  async login(req, res) {
    try {
      const { correo, password } = req.body;

      if (!correo || !password) {
        return res.status(400).json({
          success: false,
          mensaje: "Correo y contraseña son requeridos"
        });
      }

      const usuario = await UsuarioModel.obtenerPorCredenciales(correo, password);

      if (usuario) {
        res.json({
          success: true,
          mensaje: "Login correcto",
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
          }
        });
      } else {
        res.status(401).json({
          success: false,
          mensaje: "Credenciales incorrectas"
        });
      }

    } catch (error) {
      console.error("Error login:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error en el servidor"
      });
    }
  }
};

module.exports = AuthController;
