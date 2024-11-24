const PlanPruebaModel = require('../models/PlanPruebaModel');

const PlanPruebaController = {
  // Obtener todos los planes de prueba
  obtenerTodos: async (req, res) => {
    try {
      const planes = await PlanPruebaModel.obtenerTodos();
      res.status(200).json(planes);
    } catch (error) {
      console.error('Error al obtener los planes de prueba:', error);
      res.status(500).json({ message: 'Error al obtener los planes de prueba.' });
    }
  },

  // Crear un plan de prueba
  crearPlanPrueba: async (req, res) => {
    try {
      const { nombre, descripcion, id_proyecto } = req.body;

      // Validar campos obligatorios
      if (!nombre || !descripcion || !id_proyecto) {
        return res.status(400).json({ message: 'Los campos nombre, descripción e id_proyecto son obligatorios.' });
      }

      const nuevoPlan = await PlanPruebaModel.crearPlanPrueba({ nombre, descripcion, id_proyecto });
      res.status(201).json(nuevoPlan);
    } catch (error) {
      console.error('Error al crear el plan de prueba:', error);
      res.status(500).json({ message: 'Error al crear el plan de prueba.' });
    }
  },

  // Obtener un plan de prueba por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await PlanPruebaModel.obtenerPorId(id);

      if (!plan) {
        return res.status(404).json({ message: 'Plan de prueba no encontrado.' });
      }

      res.status(200).json(plan);
    } catch (error) {
      console.error('Error al obtener el plan de prueba por ID:', error);
      res.status(500).json({ message: 'Error al obtener el plan de prueba.' });
    }
  },

  // Actualizar un plan de prueba
  actualizarPlanPrueba: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const planActualizado = await PlanPruebaModel.actualizarPlanPrueba(id, datos);

      if (!planActualizado) {
        return res.status(404).json({ message: 'Plan de prueba no encontrado para actualizar.' });
      }

      res.status(200).json(planActualizado);
    } catch (error) {
      console.error('Error al actualizar el plan de prueba:', error);
      res.status(500).json({ message: 'Error al actualizar el plan de prueba.' });
    }
  },

  // Eliminar un plan de prueba
  eliminarPlanPrueba: async (req, res) => {
    try {
      const { id } = req.params;

      await PlanPruebaModel.eliminarPlanPrueba(id);
      res.status(200).json({ message: 'Plan de prueba eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar el plan de prueba:', error);
      res.status(500).json({ message: 'Error al eliminar el plan de prueba.' });
    }
  },
};

module.exports = PlanPruebaController;
