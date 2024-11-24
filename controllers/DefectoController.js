const DefectoModel = require('../models/DefectoModel');

const DefectoController = {
  // Obtener todos los defectos
  obtenerTodos: async (req, res) => {
    try {
      const defectos = await DefectoModel.obtenerTodos();
      res.status(200).json(defectos);
    } catch (error) {
      console.error('Error al obtener defectos:', error);
      res.status(500).json({ message: 'Error al obtener defectos.' });
    }
  },

  // Crear un nuevo defecto
  crearDefecto: async (req, res) => {
    try {
      const { id_ejecucion, descripcion, severidad, estado, fecha_creacion, fecha_resolucion } = req.body;

      // Validar campos obligatorios
      if (!id_ejecucion || !descripcion || !severidad || !estado || !fecha_creacion) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos.' });
      }

      const nuevoDefecto = await DefectoModel.crearDefecto({
        id_ejecucion,
        descripcion,
        severidad,
        estado,
        fecha_creacion,
        fecha_resolucion,
      });
      res.status(201).json(nuevoDefecto);
    } catch (error) {
      console.error('Error al crear defecto:', error);
      res.status(500).json({ message: 'Error al crear defecto.' });
    }
  },

  // Obtener un defecto por su ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const defecto = await DefectoModel.obtenerPorId(id);

      if (!defecto) {
        return res.status(404).json({ message: 'Defecto no encontrado.' });
      }

      res.status(200).json(defecto);
    } catch (error) {
      console.error('Error al obtener defecto por ID:', error);
      res.status(500).json({ message: 'Error al obtener defecto.' });
    }
  },

  // Actualizar un defecto por su ID
  actualizarDefecto: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const defectoActualizado = await DefectoModel.actualizarDefecto(id, datos);

      if (!defectoActualizado) {
        return res.status(404).json({ message: 'Defecto no encontrado para actualizar.' });
      }

      res.status(200).json(defectoActualizado);
    } catch (error) {
      console.error('Error al actualizar defecto:', error);
      res.status(500).json({ message: 'Error al actualizar defecto.' });
    }
  },

  // Eliminar un defecto por su ID
  eliminarDefecto: async (req, res) => {
    try {
      const { id } = req.params;

      await DefectoModel.eliminarDefecto(id);
      res.status(200).json({ message: 'Defecto eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar defecto:', error);
      res.status(500).json({ message: 'Error al eliminar defecto.' });
    }
  },
};

module.exports = DefectoController;
