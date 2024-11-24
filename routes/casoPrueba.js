const express = require('express');
const router = express.Router();
const CasoPruebaController = require('../controllers/CasoPruebaController');

// Ruta para obtener todos los casos de prueba
router.get('/', CasoPruebaController.obtenerTodos);

// Ruta para crear un nuevo caso de prueba
router.post('/', CasoPruebaController.crearCasoPrueba);

// Ruta para obtener un caso de prueba por ID
router.get('/:id', CasoPruebaController.obtenerPorId);

// Ruta para actualizar un caso de prueba por ID
router.put('/:id', CasoPruebaController.actualizarCasoPrueba);

// Ruta para eliminar un caso de prueba por ID
router.delete('/:id', CasoPruebaController.eliminarCasoPrueba);

module.exports = router;
