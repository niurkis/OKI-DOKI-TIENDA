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
  },

  async register(req, res) {
    try {
      const { nombre, correo, password } = req.body;

      if (!nombre || !correo || !password) {
        return res.status(400).json({
          success: false,
          mensaje: "Nombre, correo y contraseña son requeridos"
        });
      }

      const existente = await UsuarioModel.obtenerPorCorreo(correo);
      if (existente) {
        return res.status(409).json({
          success: false,
          mensaje: "El correo ya está registrado"
        });
      }

      if (password.length < 3) {
        return res.status(400).json({
          success: false,
          mensaje: "La contraseña debe tener al menos 3 caracteres"
        });
      }

      const nuevoUsuario = await UsuarioModel.crear({
        nombre,
        correo,
        password,
        rol: "cliente"
      });

      res.status(201).json({
        success: true,
        mensaje: "Registro exitoso",
        usuario: nuevoUsuario
      });

    } catch (error) {
      console.error("Error register:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error en el servidor"
      });
    }
  }
};

module.exports = AuthController;
