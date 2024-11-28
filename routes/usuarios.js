const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/UsuariosController'); 
const { autenticarUsuario } = require('../controllers/UsuariosController');
const { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario} = require('../controllers/UsuariosController');
const authorizeRole = require('../middlewares/authorizeRole');
const authMiddleware = require('../middlewares/authMiddleware');
const pool = require('../config/db');
 
// Rutas para autenticación (login)
router.post('/login', UsuariosController.autenticarUsuario);

// Ruta pública para registrar usuarios desde el registro.html
router.post('/public', UsuariosController.crearUsuario);
 
// Rutas protegidas (solo para Administradores)
router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador', 'Scrum Master', 'Líder de Proyecto']), // Permitir roles específicos
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

// Rutas protegidas para obtener el rol del usuario autenticado
router.get(
    '/rol',
    authMiddleware.verifyToken, // Verificar que el usuario esté autenticado
    (req, res) => {
        try {
            const rol = req.user.rol; // `req.user` es agregado por `verifyToken` al decodificar el JWT
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado.' });
            }
            res.status(200).json({ rol });
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
            res.status(500).json({ message: 'Error al obtener el rol del usuario.' });
        }
    }
);

// Obtener el rol del usuario autenticado
router.get(
    '/me',
    authMiddleware.verifyToken, // Verifica que el token sea válido
    async (req, res) => {
        try {
            const { id } = req.user; // El token decodificado contiene el ID del usuario
            const result = await pool.query('SELECT id, nombre, rol FROM usuarios WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            res.status(200).json(result.rows[0]); // Devuelve la información del usuario
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
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