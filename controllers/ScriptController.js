const ScriptModel = require('../models/ScriptModel');
 
const ScriptController = {
  // Obtener todos los scripts
  obtenerTodos: async (req, res) => {
    try {
      const scripts = await ScriptModel.obtenerTodos();
      res.status(200).json(scripts);
    } catch (error) {
      console.error('Error al obtener los scripts:', error);
      res.status(500).json({ message: 'Error al obtener los scripts.' });
    }
  },
 
  // Crear un script
  crearScript: async (req, res) => {
    try {
      const { id_proyecto, nombre, descripcion, contenido } = req.body;
 
      // Validar campos obligatorios
      if (!id_proyecto || !nombre || !descripcion || !contenido) {
        return res.status(400).json({
          message: 'Los campos id_proyecto, nombre, descripcion y contenido son obligatorios.',
        });
      }
 
      // Obtener el usuario creador del token
      const id_usuario_creador = req.user.id;
 
      const nuevoScript = await ScriptModel.crearScript({
        id_proyecto,
        nombre,
        descripcion,
        contenido,
        id_usuario_creador,
      });
 
      res.status(201).json(nuevoScript);
    } catch (error) {
      console.error('Error al crear el script:', error);
      res.status(500).json({ message: 'Error al crear el script.' });
    }
  },
 
  // Obtener un script por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const script = await ScriptModel.obtenerPorId(id);
 
      if (!script) {
        return res.status(404).json({ message: 'Script no encontrado.' });
      }
 
      res.status(200).json(script);
    } catch (error) {
      console.error('Error al obtener el script por ID:', error);
      res.status(500).json({ message: 'Error al obtener el script.' });
    }
  },
 
  // Actualizar un script
  actualizarScript: async (req, res) => {
    try {
        const { id } = req.params;
        const { id_proyecto, id_usuario, nombre, descripcion, contenido } = req.body;

        if (!id_proyecto || !id_usuario || !nombre || !descripcion || !contenido) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const scriptActualizado = await ScriptModel.actualizarScript(id, {
            id_proyecto,
            id_usuario,
            nombre,
            descripcion,
            contenido,
        });

        if (!scriptActualizado) {
            return res.status(404).json({ message: 'Script no encontrado para actualizar.' });
        }

        res.status(200).json(scriptActualizado);
    } catch (error) {
        console.error('Error al actualizar el script:', error);
        res.status(500).json({ message: 'Error al actualizar el script.' });
    }
},
 
  // Eliminar un script
  eliminarScript: async (req, res) => {
    try {
        const { id } = req.params;

        const script = await ScriptModel.obtenerPorId(id);
        if (!script) {
            return res.status(404).json({ message: 'Script no encontrado.' });
        }

        const eliminado = await ScriptModel.eliminarScript(id);
        res.status(200).json({ message: 'Script eliminado correctamente.', eliminado });
    } catch (error) {
        console.error('Error al eliminar el script:', error);
        res.status(500).json({ message: 'Error al eliminar el script.' });
    }
},

};
 
module.exports = ScriptController;