const HistorialDefectoModel = require('../models/HistorialDefectoModel');

const HistorialDefectoController = {
  // Obtener todos los historiales de defectos
  obtenerTodos: async (req, res) => {
    try {
      const historiales = await HistorialDefectoModel.obtenerTodos();
      res.status(200).json(historiales);
    } catch (error) {
      console.error('Error al obtener historiales de defectos:', error);
      res.status(500).json({ message: 'Error al obtener historiales de defectos.' });
    }
  },

  // Crear un historial de defecto
  crearHistorial: async (req, res) => {
    try {
      const { id_defecto, estado, fecha_cambio, comentarios } = req.body;

      // Validar campos obligatorios
      if (!id_defecto || !estado || !fecha_cambio) {
        return res.status(400).json({ message: 'Los campos id_defecto, estado y fecha_cambio son obligatorios.' });
      }

      const nuevoHistorial = await HistorialDefectoModel.crearHistorial({
        id_defecto,
        estado,
        fecha_cambio,
        comentarios,
      });

      res.status(201).json(nuevoHistorial);
    } catch (error) {
      console.error('Error al crear historial de defecto:', error);
      res.status(500).json({ message: 'Error al crear historial de defecto.' });
    }
  },

  // Obtener un historial de defecto por su ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const historial = await HistorialDefectoModel.obtenerPorId(id);

      if (!historial) {
        return res.status(404).json({ message: 'Historial de defecto no encontrado.' });
      }

      res.status(200).json(historial);
    } catch (error) {
      console.error('Error al obtener historial de defecto por ID:', error);
      res.status(500).json({ message: 'Error al obtener historial de defecto.' });
    }
  },

  // Actualizar un historial de defecto por su ID
  actualizarHistorial: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const historialActualizado = await HistorialDefectoModel.actualizarHistorial(id, datos);

      if (!historialActualizado) {
        return res.status(404).json({ message: 'Historial de defecto no encontrado para actualizar.' });
      }

      res.status(200).json(historialActualizado);
    } catch (error) {
      console.error('Error al actualizar historial de defecto:', error);
      res.status(500).json({ message: 'Error al actualizar historial de defecto.' });
    }
  },

  // Eliminar un historial de defecto por su ID
  eliminarHistorial: async (req, res) => {
    try {
      const { id } = req.params;

      await HistorialDefectoModel.eliminarHistorial(id);
      res.status(200).json({ message: 'Historial de defecto eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar historial de defecto:', error);
      res.status(500).json({ message: 'Error al eliminar historial de defecto.' });
    }
  },
};

module.exports = HistorialDefectoController;
