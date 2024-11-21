const Usuario = require('../models/UsuarioModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../middlewares/emailService');
const { enviarCorreo } = require('../middlewares/emailService');
 
exports.crearUsuario = async (req, res) => {
  try {
      const { nombre, email, rol, contrasena } = req.body;

      // Validación de campos obligatorios
      if (!nombre || !email || !rol || !contrasena) {
          return res.status(400).json({ message: 'Todos los campos son requeridos.' });
      }

      // Validar nombre único
      const nombreExistente = await Usuario.obtenerPorNombre(nombre);
      if (nombreExistente) {
          return res.status(400).json({ message: 'El nombre ya está registrado.' });
      }

      // Validación de email único
      const emailExistente = await Usuario.obtenerPorEmail(email);
      if (emailExistente) {
          return res.status(400).json({ message: 'El email ya está registrado.' });
      }

      // Validar longitud de la contraseña
      if (contrasena.length < 15) {
          return res.status(400).json({ message: 'La contraseña debe tener al menos 15 caracteres.' });
      }

      // Validar contraseña (mayúsculas, símbolos, números)
      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{15,}$/;
      if (!regex.test(contrasena)) {
          return res.status(400).json({ message: 'La contraseña debe contener al menos una mayúscula, un número y un símbolo.' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      // Crear el usuario
      const nuevoUsuario = await Usuario.crearUsuario({ nombre, email, rol, contrasena: hashedPassword });
      res.status(201).json({ message: 'Usuario creado exitosamente.', usuario: nuevoUsuario });
  } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
 
// Crear múltiples usuarios con validaciones
exports.crearUsuarios = async (req, res) => {
    try {
      const usuarios = req.body; // Asumimos que envías un array de usuarios
      // Validar que hay datos para procesar
      if (!Array.isArray(usuarios) || usuarios.length === 0) {
        return res.status(400).json({ message: 'Se debe proporcionar un array de usuarios' });
      }
   
      // Validar cada usuario
      for (let usuario of usuarios) {
        const { nombre, email, rol, contrasena } = usuario;
   
        // Validación de nombre, email, rol y contrasena
        if (!nombre || !email || !rol || !contrasena) {
          return res.status(400).json({ message: 'Nombre, email, rol y contraseña son requeridos' });
        }
   
        // Validación de email único
        const emailExistente = await Usuario.obtenerPorEmail(email);
        if (emailExistente) {
          return res.status(400).json({ message: `El email ${email} ya está registrado` });
        }
   
        // Validación de longitud de la contraseña
        if (contrasena.length < 15) {
          return res.status(400).json({ message: `La contraseña de ${nombre} debe tener al menos 15 caracteres` });
        }
   
        // Validación de contraseña (al menos una mayúscula, un número y un símbolo)
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{15,}$/;
        if (!regex.test(contrasena)) {
          return res.status(400).json({ message: `La contraseña de ${nombre} debe contener al menos una mayúscula, un número y un símbolo` });
        }
   
        // Hash de la contraseña
        const hash = await bcrypt.hash(contrasena, 10);
   
        // Guardar usuario con la contraseña cifrada
        await Usuario.crearUsuario({ nombre, email, rol, contrasena: hash });
      }
   
      // Si todos los usuarios son creados correctamente
      res.status(201).json({ message: 'Usuarios creados correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
 
 
// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.obtenerTodos();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.obtenerPorId(req.params.id);
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { nombre, email, rol, contrasena } = req.body;
 
        // Hashear la nueva contraseña si es proporcionada
        const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : undefined;
 
        const usuarioActualizado = await Usuario.actualizarUsuario(req.params.id, {
            nombre,
            email,
            rol,
            contrasena: hashedPassword || undefined,
        });
 
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        await Usuario.eliminarUsuario(req.params.id);
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Autenticar usuario (login)
exports.autenticarUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        const usuario = await Usuario.obtenerPorEmail(email);
 
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
 
        // Verificar la contraseña
        const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
 
        if (!esValida) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
 
        // Generar token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
 
        res.status(200).json({ message: 'Autenticación exitosa', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Envios de correo prueba
exports.enviarCorreoPrueba = async (req, res) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'destinatario@gmail.com',
            subject: 'Prueba',
            text: 'Este es un correo de prueba.',
        });
 
        res.status(200).json({ message: 'Correo enviado', id: info.messageId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Envios de correo definitivo
exports.enviarCorreoRestablecimiento = async (req, res) => {
    try {
        const { email } = req.body;
 
        // Verificar si el correo existe en la BD
        const usuario = await Usuario.obtenerPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ message: 'El correo no está registrado.' });
        }
 
        // Generar un token único (opcional, para el enlace)
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
 
        // Enviar correo con el enlace de restablecimiento
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Restablecimiento de Contraseña',
            html: `
<p>Hola, ${usuario.nombre},</p>
<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
<a href="http://localhost:3000/reset-password/${token}">Restablecer Contraseña</a>
<p>Este enlace expirará en 1 hora.</p>
            `,
        });
 
        res.status(200).json({ message: 'Correo de restablecimiento enviado.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo.' });
    }
};




// Generar token y enviar correo
exports.generarTokenRestablecimiento = async (req, res) => {
    try {
        const { email } = req.body;
 
        // Verificar si el usuario existe
        const usuario = await Usuario.obtenerPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ message: 'Correo no registrado.' });
        }
 
        // Generar token y fecha de expiración
        const token = crypto.randomBytes(32).toString('hex');
        const expiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
 
        // Guardar token en la base de datos
        await Usuario.guardarTokenRestablecimiento(usuario.id, token, expiracion);
 
        // Enviar correo con el enlace de restablecimiento
        const enlace = `http://localhost:3000/reset_password?token=${token}`;
        await enviarCorreo(email, 'Restablecimiento de contraseña', `Haz clic en el siguiente enlace para restablecer tu contraseña: ${enlace}`);
 
        res.status(200).json({ message: 'Correo de restablecimiento enviado.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};
 
// Validar token y permitir restablecimiento
exports.validarTokenRestablecimiento = async (req, res) => {
    try {
        const { token } = req.query;
 
        // Verificar si el token es válido
        const usuario = await Usuario.obtenerPorToken(token);
        if (!usuario || usuario.expiracion_token < new Date()) {
            return res.status(400).json({ message: 'Token inválido o expirado.' });
        }
 
        res.status(200).json({ message: 'Token válido. Permitir cambio de contraseña.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al validar el token.' });
    }
};
 
// Restablecer contraseña
exports.restablecerContrasena = async (req, res) => {
    try {
        const { token, nuevaContrasena } = req.body;
 
        // Verificar si el token es válido
        const usuario = await Usuario.obtenerPorToken(token);
        if (!usuario || usuario.expiracion_token < new Date()) {
            return res.status(400).json({ message: 'Token inválido o expirado.' });
        }
 
        // Validar y cifrar nueva contraseña
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{15,}$/;
        if (!regex.test(nuevaContrasena)) {
            return res.status(400).json({ message: 'La contraseña debe cumplir los requisitos.' });
        }
 
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
        await Usuario.actualizarContrasena(usuario.id, hashedPassword);
 
        // Eliminar token
        await Usuario.eliminarTokenRestablecimiento(usuario.id);
 
        res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};