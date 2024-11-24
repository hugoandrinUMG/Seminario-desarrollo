const DocumentoModel = require('../models/DocumentoModel');

const DocumentoController = {
  // Obtener todos los documentos
  obtenerTodos: async (req, res) => {
    try {
      const documentos = await DocumentoModel.obtenerTodos();
      res.status(200).json(documentos);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      res.status(500).json({ message: 'Error al obtener documentos.' });
    }
  },

  // Crear un nuevo documento
  crearDocumento: async (req, res) => {
    try {
      const { id_proyecto, nombre, tipo, ruta, fecha_subida } = req.body;

      // Validar campos obligatorios
      if (!id_proyecto || !nombre || !tipo || !ruta || !fecha_subida) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos.' });
      }

      const nuevoDocumento = await DocumentoModel.crearDocumento({
        id_proyecto,
        nombre,
        tipo,
        ruta,
        fecha_subida,
      });
      res.status(201).json(nuevoDocumento);
    } catch (error) {
      console.error('Error al crear documento:', error);
      res.status(500).json({ message: 'Error al crear documento.' });
    }
  },

  // Obtener un documento por su ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const documento = await DocumentoModel.obtenerPorId(id);

      if (!documento) {
        return res.status(404).json({ message: 'Documento no encontrado.' });
      }

      res.status(200).json(documento);
    } catch (error) {
      console.error('Error al obtener documento por ID:', error);
      res.status(500).json({ message: 'Error al obtener documento.' });
    }
  },

  // Actualizar un documento por su ID
  actualizarDocumento: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const documentoActualizado = await DocumentoModel.actualizarDocumento(id, datos);

      if (!documentoActualizado) {
        return res.status(404).json({ message: 'Documento no encontrado para actualizar.' });
      }

      res.status(200).json(documentoActualizado);
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      res.status(500).json({ message: 'Error al actualizar documento.' });
    }
  },

  // Eliminar un documento por su ID
  eliminarDocumento: async (req, res) => {
    try {
      const { id } = req.params;

      await DocumentoModel.eliminarDocumento(id);
      res.status(200).json({ message: 'Documento eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      res.status(500).json({ message: 'Error al eliminar documento.' });
    }
  },
};

module.exports = DocumentoController;
