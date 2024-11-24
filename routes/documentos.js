const express = require('express');
const router = express.Router();
const DocumentoController = require('../controllers/DocumentoController');

// Ruta para obtener todos los documentos
router.get('/', DocumentoController.obtenerTodos);

// Ruta para crear un documento
router.post('/', DocumentoController.crearDocumento);

// Ruta para obtener un documento por ID
router.get('/:id', DocumentoController.obtenerPorId);

// Ruta para actualizar un documento por ID
router.put('/:id', DocumentoController.actualizarDocumento);

// Ruta para eliminar un documento por ID
router.delete('/:id', DocumentoController.eliminarDocumento);

module.exports = router;
