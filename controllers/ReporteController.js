const ReporteModel = require('../models/ReporteModel');

const ReporteController = {
  // Obtener todos los reportes
  obtenerTodos: async (req, res) => {
    try {
      const reportes = await ReporteModel.obtenerTodos();
      res.status(200).json(reportes);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      res.status(500).json({ message: 'Error al obtener los reportes.' });
    }
  },

  // Crear un reporte
  crearReporte: async (req, res) => {
    try {
      const { id_proyecto, titulo, contenido, fecha_generacion } = req.body;

      // Validar campos obligatorios
      if (!id_proyecto || !titulo || !contenido || !fecha_generacion) {
        return res
          .status(400)
          .json({ message: 'Los campos id_proyecto, titulo, contenido y fecha_generacion son obligatorios.' });
      }

      const nuevoReporte = await ReporteModel.crearReporte({ id_proyecto, titulo, contenido, fecha_generacion });
      res.status(201).json(nuevoReporte);
    } catch (error) {
      console.error('Error al crear el reporte:', error);
      res.status(500).json({ message: 'Error al crear el reporte.' });
    }
  },

  // Obtener un reporte por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const reporte = await ReporteModel.obtenerPorId(id);

      if (!reporte) {
        return res.status(404).json({ message: 'Reporte no encontrado.' });
      }

      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error al obtener el reporte por ID:', error);
      res.status(500).json({ message: 'Error al obtener el reporte.' });
    }
  },

  // Actualizar un reporte
  actualizarReporte: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const reporteActualizado = await ReporteModel.actualizarReporte(id, datos);

      if (!reporteActualizado) {
        return res.status(404).json({ message: 'Reporte no encontrado para actualizar.' });
      }

      res.status(200).json(reporteActualizado);
    } catch (error) {
      console.error('Error al actualizar el reporte:', error);
      res.status(500).json({ message: 'Error al actualizar el reporte.' });
    }
  },

  // Eliminar un reporte
  eliminarReporte: async (req, res) => {
    try {
      const { id } = req.params;

      await ReporteModel.eliminarReporte(id);
      res.status(200).json({ message: 'Reporte eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      res.status(500).json({ message: 'Error al eliminar el reporte.' });
    }
  },
};

module.exports = ReporteController;
