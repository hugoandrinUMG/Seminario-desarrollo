const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/UsuariosController'); 
const { autenticarUsuario } = require('../controllers/UsuariosController');
const { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario} = require('../controllers/UsuariosController');
const authorizeRole = require('../middlewares/authorizeRole');
const authMiddleware = require('../middlewares/authMiddleware');
 
// Rutas para autenticación (login)
router.post('/login', UsuariosController.autenticarUsuario);

// Ruta pública para registrar usuarios desde el registro.html
router.post('/public', UsuariosController.crearUsuario);
 
// Rutas protegidas (solo para Administradores)
router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador']),
    UsuariosController.obtenerUsuarios
);
router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador']),
    UsuariosController.crearUsuario
);
router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador']),
    UsuariosController.actualizarUsuario
);
router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador']),
    UsuariosController.eliminarUsuario
);
 
// Rutas para restablecimiento de contraseñas (públicas)
router.post('/reset-password', UsuariosController.enviarCorreoRestablecimiento);
router.get('/validar-token', UsuariosController.validarTokenRestablecimiento);
router.post('/restablecer-contrasena', UsuariosController.restablecerContrasena);
router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    res.sendFile(path.join(__dirname, '/../public/actualizar_clave.html'));
});
 

 
module.exports = router;