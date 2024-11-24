const express = require('express');
const router = express.Router();
const ProyectosController = require('../controllers/ProyectosController');

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

module.exports = router;
