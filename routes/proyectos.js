const express = require('express');
const router = express.Router();
const ProyectosController = require('../controllers/ProyectosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para obtener todos los proyectos
router.get('/', ProyectosController.obtenerProyectos);

// Ruta para crear un proyecto
router.post('/', ProyectosController.crearProyecto);

// Ruta para obtener un proyecto por ID
router.get('/:id', ProyectosController.obtenerProyectoPorId);

// Ruta para actualizar un proyecto
router.put('/:id', ProyectosController.actualizarProyecto);

// Ruta para eliminar un proyecto
router.delete('/:id', ProyectosController.eliminarProyecto);


// Ruta para obtener todos los proyectos (accesible solo para Admin y Líder de Proyecto)
router.get('/', authMiddleware.verifyToken, authMiddleware.verifyRole(['Administrador', 'Líder de Proyecto']), ProyectosController.obtenerProyectos);
 
// Ruta para crear un proyecto (accesible solo para Líder de Proyecto)
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyRole(['Líder de Proyecto']), ProyectosController.crearProyecto);
 
// Ruta para actualizar un proyecto (accesible para Admin y Líder de Proyecto)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole(['Administrador', 'Líder de Proyecto']), ProyectosController.actualizarProyecto);
 
// Ruta para eliminar un proyecto (accesible solo para Administrador)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole(['Administrador']), ProyectosController.eliminarProyecto);

module.exports = router;
