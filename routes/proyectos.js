const express = require('express');
const router = express.Router();
const ProyectosController = require('../controllers/ProyectosController');
const authMiddleware = require('../middlewares/authMiddleware');
 
// Obtener todos los proyectos (todos los usuarios autenticados pueden acceder)
router.get('/', authMiddleware.verifyToken, ProyectosController.obtenerProyectos);
 
// Obtener un proyecto por ID (todos los usuarios autenticados pueden acceder)
router.get('/:id', authMiddleware.verifyToken, ProyectosController.obtenerProyectoPorId);
 
// Crear proyecto (solo Administradores, Líderes de Proyecto y Scrum Masters)
router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador', 'Líder de Proyecto', 'Scrum Master']),
    ProyectosController.crearProyecto
);
 
// Actualizar proyecto (solo Administradores, Líderes de Proyecto y Scrum Masters)
router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador', 'Líder de Proyecto', 'Scrum Master']),
    ProyectosController.actualizarProyecto
);
 
// Eliminar proyecto (solo Administradores)
router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole(['Administrador', 'Líder de Proyecto', 'Scrum Master']),
    ProyectosController.eliminarProyecto
);
 
module.exports = router;