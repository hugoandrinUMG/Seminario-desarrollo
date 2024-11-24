const express = require('express');
const router = express.Router();
const HistorialDefectoController = require('../controllers/HistorialDefectoController');

// Ruta para obtener todos los historiales de defectos
router.get('/', HistorialDefectoController.obtenerTodos);

// Ruta para crear un historial de defecto
router.post('/', HistorialDefectoController.crearHistorial);

// Ruta para obtener un historial de defecto por ID
router.get('/:id', HistorialDefectoController.obtenerPorId);

// Ruta para actualizar un historial de defecto por ID
router.put('/:id', HistorialDefectoController.actualizarHistorial);

// Ruta para eliminar un historial de defecto por ID
router.delete('/:id', HistorialDefectoController.eliminarHistorial);

module.exports = router;
