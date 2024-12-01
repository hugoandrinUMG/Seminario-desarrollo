const express = require('express');
const router = express.Router();
const EjecucionPruebaController = require('../controllers/EjecucionPruebaController');
const ScriptController = require('../controllers/ScriptController');
const { evaluateCode } = require('../middlewares/codeEvaluator');  // Función para evaluar código

// Ruta para evaluar código y asociarlo con una ejecución de prueba
router.post('/evaluarCodigo', async (req, res) => {
  try {
      const { codigo, api } = req.body;

      console.log('Solicitud recibida en /api/evaluarCodigo');
      console.log('Código:', codigo);
      console.log('API seleccionada:', api);

      if (!codigo || !api) {
          return res.status(400).json({ message: 'Código o API no proporcionados.' });
      }

      const result = await evaluateCode(codigo, api);
      console.log('Resultado de evaluación:', result);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error al evaluar código:', error);
      res.status(500).json({ message: 'Error al evaluar el código.' });
  }
});


// Ruta para obtener todas las ejecuciones de prueba
router.get('/', EjecucionPruebaController.obtenerTodas);  // Verifica que esta función esté correctamente definida en el controlador

// Ruta para crear una ejecución de prueba
router.post('/', EjecucionPruebaController.crearEjecucionPrueba);

// Obtener un script por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const script = await ScriptModel.obtenerPorId(id); // Asegúrate de que esta función esté implementada
    if (!script) {
      return res.status(404).json({ message: 'Script no encontrado.' });
    }
    res.status(200).json(script);
  } catch (error) {
    console.error('Error al obtener script:', error);
    res.status(500).json({ message: 'Error al obtener script.' });
  }
});

// Ruta para actualizar una ejecución de prueba por ID
router.put('/:id', EjecucionPruebaController.actualizarEjecucionPrueba);  // Verifica que esta función esté correctamente definida en el controlador

// Ruta para eliminar una ejecución de prueba por ID
router.delete('/:id', EjecucionPruebaController.eliminarEjecucionPrueba);  // Verifica que esta función esté correctamente definida en el controlador

module.exports = router;

