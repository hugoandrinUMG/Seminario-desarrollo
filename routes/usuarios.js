const express = require('express');
const router = express.Router();
const { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario} = require('../controllers/UsuariosController');
const UsuariosController = require('../controllers/UsuariosController'); 
const { autenticarUsuario } = require('../controllers/UsuariosController');
 
// Ruta para crear un usuario
router.post('/', crearUsuario);

// Ruta para crear múltiples usuarios
router.post('/crear-multiples', UsuariosController.crearUsuarios);
 
// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);
 
// Ruta para obtener un usuario por ID
router.get('/:id', obtenerUsuarioPorId);
 
// Ruta para actualizar un usuario
router.put('/:id', actualizarUsuario);
 
// Ruta para eliminar un usuario
router.delete('/:id', eliminarUsuario);

// Ruta para login
router.post('/login', autenticarUsuario);

// Ruta para el envio de correos
//router.post('/reset-password', UsuariosController.enviarCorreoRestablecimiento);

// Enviar correo de restablecimiento
router.post('/enviar-correo-restablecimiento', UsuariosController.enviarCorreoRestablecimiento);
 
// Validar token
router.get('/validar-token', UsuariosController.validarTokenRestablecimiento);
 
// Restablecer contraseña
router.post('/reset-password', UsuariosController.restablecerContrasena);
 
module.exports = router;