const express = require('express');
const router = express.Router();
const ScriptController = require('../controllers/ScriptController');
const authMiddleware = require('../middlewares/authMiddleware');
 
// Ruta para obtener todos los scripts (acceso para todos los roles)
router.get('/', authMiddleware.verifyToken, ScriptController.obtenerTodos);
 
// Crear script (solo roles permitidos)
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.verifyRole(['Administrador', 'Desarrollador', 'Arquitecto de Software']),
  ScriptController.crearScript
);
 
// Actualizar script (solo roles permitidos)
router.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyRole(['Administrador', 'Desarrollador', 'Arquitecto de Software']),
  ScriptController.actualizarScript
);
 
// Eliminar script (solo roles permitidos)
router.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.verifyRole(['Administrador', 'Desarrollador', 'Arquitecto de Software']),
  ScriptController.eliminarScript
);
 
// Obtener script por ID (acceso para todos los roles)
router.get('/:id', authMiddleware.verifyToken, ScriptController.obtenerPorId);
 
module.exports = router;