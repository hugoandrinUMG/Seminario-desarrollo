const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/ReporteController');

// Ruta para obtener todos los reportes
router.get('/', ReporteController.obtenerTodos);

// Ruta para crear un reporte
router.post('/', ReporteController.crearReporte);

// Ruta para obtener un reporte por ID
router.get('/:id', ReporteController.obtenerPorId);

// Ruta para actualizar un reporte por ID
router.put('/:id', ReporteController.actualizarReporte);

// Ruta para eliminar un reporte por ID
router.delete('/:id', ReporteController.eliminarReporte);

module.exports = router;
