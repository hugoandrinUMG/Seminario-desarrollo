const express = require('express');
const router = express.Router();
const EjecucionPruebaController = require('../controllers/EjecucionPruebaController');

// Ruta para obtener todas las ejecuciones de prueba
router.get('/', EjecucionPruebaController.obtenerTodas);

// Ruta para crear una ejecución de prueba
router.post('/', EjecucionPruebaController.crearEjecucionPrueba);

// Ruta para obtener una ejecución de prueba por ID
router.get('/:id', EjecucionPruebaController.obtenerPorId);

// Ruta para actualizar una ejecución de prueba por ID
router.put('/:id', EjecucionPruebaController.actualizarEjecucionPrueba);

// Ruta para eliminar una ejecución de prueba por ID
router.delete('/:id', EjecucionPruebaController.eliminarEjecucionPrueba);

module.exports = router;

