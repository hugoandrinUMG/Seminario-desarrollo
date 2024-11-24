const express = require('express');
const router = express.Router();
const ScriptController = require('../controllers/ScriptController');

// Ruta para obtener todos los scripts
router.get('/', ScriptController.obtenerTodos);

// Ruta para crear un script
router.post('/', ScriptController.crearScript);

// Ruta para obtener un script por ID
router.get('/:id', ScriptController.obtenerPorId);

// Ruta para actualizar un script por ID
router.put('/:id', ScriptController.actualizarScript);

// Ruta para eliminar un script por ID
router.delete('/:id', ScriptController.eliminarScript);

module.exports = router;
