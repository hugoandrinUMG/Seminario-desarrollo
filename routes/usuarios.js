const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/UsuariosController'); 
const { autenticarUsuario } = require('../controllers/UsuariosController');
const { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario} = require('../controllers/UsuariosController');
const authorizeRole = require('../middlewares/authorizeRole');
 
// Rutas para usuarios
router.post('/', UsuariosController.crearUsuario); // Crear un usuario
router.post('/crear-multiples', UsuariosController.crearUsuarios); // Crear múltiples usuarios
router.get('/', UsuariosController.obtenerUsuarios); // Obtener todos los usuarios
router.get('/:id', UsuariosController.obtenerUsuarioPorId); // Obtener un usuario por ID
router.put('/:id', UsuariosController.actualizarUsuario); // Actualizar un usuario
router.delete('/:id', UsuariosController.eliminarUsuario); // Eliminar un usuario
 
// Ruta para autenticación (login)
router.post('/login', UsuariosController.autenticarUsuario);
 
// Rutas para restablecimiento de contraseñas
router.post('/reset-password', UsuariosController.enviarCorreoRestablecimiento); // Enviar correo de restablecimiento
router.get('/validar-token', UsuariosController.validarTokenRestablecimiento); // Validar token de restablecimiento
router.post('/restablecer-contrasena', UsuariosController.restablecerContrasena); // Restablecer contraseña

// Ruta para servir la vista de restablecimiento de contraseña
router.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  res.sendFile(path.join(__dirname, '/../public/actualizar_clave.html'));
});

// Roles para gestion de usuarios dentro del dashboard
router.get('/', authorizeRole('Administrador'), UsuariosController.obtenerUsuarios);
router.post('/', authorizeRole('Administrador'), UsuariosController.crearUsuario);
router.put('/:id', authorizeRole('Administrador'), UsuariosController.actualizarUsuario);
router.delete('/:id', authorizeRole('Administrador'), UsuariosController.eliminarUsuario);

 
module.exports = router;