const EjecucionPruebaModel = require('../models/EjecucionPruebaModel');

const EjecucionPruebaController = {
  // Obtener todas las ejecuciones de prueba
  obtenerTodas: async (req, res) => {
    try {
      const ejecuciones = await EjecucionPruebaModel.obtenerTodas();
      res.status(200).json(ejecuciones);
    } catch (error) {
      console.error('Error al obtener ejecuciones de prueba:', error);
      res.status(500).json({ message: 'Error al obtener ejecuciones de prueba.' });
    }
  },

  // Crear una nueva ejecución de prueba
  crearEjecucionPrueba: async (req, res) => {
    try {
      const { id_caso_prueba, id_plan_prueba, fecha_ejecucion, resultado, observaciones } = req.body;

      // Validar campos obligatorios
      if (!id_caso_prueba || !id_plan_prueba || !fecha_ejecucion || !resultado) {
        return res.status(400).json({ message: 'Los campos id_caso_prueba, id_plan_prueba, fecha_ejecucion y resultado son obligatorios.' });
      }

      const nuevaEjecucion = await EjecucionPruebaModel.crearEjecucionPrueba({
        id_caso_prueba,
        id_plan_prueba,
        fecha_ejecucion,
        resultado,
        observaciones,
      });

      res.status(201).json(nuevaEjecucion);
    } catch (error) {
      console.error('Error al crear ejecución de prueba:', error);
      res.status(500).json({ message: 'Error al crear ejecución de prueba.' });
    }
  },

  // Obtener una ejecución de prueba por su ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const ejecucion = await EjecucionPruebaModel.obtenerPorId(id);

      if (!ejecucion) {
        return res.status(404).json({ message: 'Ejecución de prueba no encontrada.' });
      }

      res.status(200).json(ejecucion);
    } catch (error) {
      console.error('Error al obtener ejecución de prueba por ID:', error);
      res.status(500).json({ message: 'Error al obtener ejecución de prueba.' });
    }
  },

  // Actualizar una ejecución de prueba por su ID
  actualizarEjecucionPrueba: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const ejecucionActualizada = await EjecucionPruebaModel.actualizarEjecucionPrueba(id, datos);

      if (!ejecucionActualizada) {
        return res.status(404).json({ message: 'Ejecución de prueba no encontrada para actualizar.' });
      }

      res.status(200).json(ejecucionActualizada);
    } catch (error) {
      console.error('Error al actualizar ejecución de prueba:', error);
      res.status(500).json({ message: 'Error al actualizar ejecución de prueba.' });
    }
  },

  // Eliminar una ejecución de prueba por su ID
  eliminarEjecucionPrueba: async (req, res) => {
    try {
      const { id } = req.params;

      await EjecucionPruebaModel.eliminarEjecucionPrueba(id);
      res.status(200).json({ message: 'Ejecución de prueba eliminada correctamente.' });
    } catch (error) {
      console.error('Error al eliminar ejecución de prueba:', error);
      res.status(500).json({ message: 'Error al eliminar ejecución de prueba.' });
    }
  },
};

module.exports = EjecucionPruebaController;
