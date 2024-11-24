const express = require('express');
const router = express.Router();
const PlanPruebaController = require('../controllers/PlanPruebaController');

// Ruta para obtener todos los planes de prueba
router.get('/', PlanPruebaController.obtenerTodos);

// Ruta para crear un plan de prueba
router.post('/', PlanPruebaController.crearPlanPrueba);

// Ruta para obtener un plan de prueba por ID
router.get('/:id', PlanPruebaController.obtenerPorId);

// Ruta para actualizar un plan de prueba por ID
router.put('/:id', PlanPruebaController.actualizarPlanPrueba);

// Ruta para eliminar un plan de prueba por ID
router.delete('/:id', PlanPruebaController.eliminarPlanPrueba);

module.exports = router;
