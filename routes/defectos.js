const express = require('express');
const router = express.Router();
const DefectoController = require('../controllers/DefectoController');

// Ruta para obtener todos los defectos
router.get('/', DefectoController.obtenerTodos);

// Ruta para crear un defecto
router.post('/', DefectoController.crearDefecto);

// Ruta para obtener un defecto por ID
router.get('/:id', DefectoController.obtenerPorId);

// Ruta para actualizar un defecto por ID
router.put('/:id', DefectoController.actualizarDefecto);

// Ruta para eliminar un defecto por ID
router.delete('/:id', DefectoController.eliminarDefecto);

module.exports = router;

