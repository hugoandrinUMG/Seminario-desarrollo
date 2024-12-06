const CasoPrueba = require('../models/CasoPruebaModel');

const CasoPruebaController = {
  // Obtener todos los casos de prueba
  obtenerTodos: async (req, res) => {
    try {
        const casosPrueba = await CasoPrueba.obtenerTodos();
        console.log('Casos de prueba enviados al frontend:', casosPrueba); // Log para depurar
        res.status(200).json(casosPrueba);
    } catch (error) {
        console.error('Error al obtener casos de prueba:', error.message);
        res.status(500).json({ message: 'Error al obtener casos de prueba.' });
    }
},



  // Crear un nuevo caso de prueba
  crearCasoPrueba: async (req, res) => {
    try {
        const { id_proyecto, id_script, id_usuario, nombre, descripcion, pasos, resultado_esperado } = req.body;

        console.log('Datos recibidos en el controlador:', { pasos, resultado_esperado });

        if (!id_proyecto || !id_script || !id_usuario || !nombre || !descripcion || !pasos || !resultado_esperado) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const nuevoCasoPrueba = await CasoPrueba.crearCasoPrueba({
            id_proyecto,
            id_script,
            id_usuario,
            nombre,
            descripcion,
            pasos,
            resultado_esperado,
        });

        res.status(201).json({ message: 'Caso de prueba creado exitosamente.', casoPrueba: nuevoCasoPrueba });
    } catch (error) {
        console.error('Error al crear caso de prueba:', error.message);
        res.status(500).json({ message: 'Error al crear caso de prueba.' });
    }
},


  // Obtener un caso de prueba por ID
  obtenerPorId: async (req, res) => {
    try {
        const { id } = req.params;
        const casoPrueba = await CasoPrueba.obtenerPorId(id);

        if (!casoPrueba) {
            return res.status(404).json({ message: 'Caso de prueba no encontrado.' });
        }

        console.log('Caso de prueba enviado al frontend:', casoPrueba); // Log para depuración
        res.status(200).json(casoPrueba);
    } catch (error) {
        console.error('Error al obtener caso de prueba por ID:', error.message);
        res.status(500).json({ message: 'Error al obtener caso de prueba.' });
    }
},


  // Actualizar un caso de prueba
  actualizarCasoPrueba: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_proyecto, id_script, id_usuario, nombre, descripcion, pasos, resultado_esperado } = req.body;

      // Validar campos obligatorios
      if (!id_proyecto || !id_script || !id_usuario || !nombre || !descripcion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      }

      console.log('Datos recibidos para actualizar:', {
        id_proyecto,
        id_script,
        id_usuario,
        nombre,
        descripcion,
        pasos,
        resultado_esperado,
      });

      const casoPruebaActualizado = await CasoPrueba.actualizarCasoPrueba(id, {
        id_proyecto,
        id_script,
        id_usuario,
        nombre,
        descripcion,
        pasos,
        resultado_esperado,
      });

      if (!casoPruebaActualizado) {
        return res.status(404).json({ message: 'Caso de prueba no encontrado.' });
      }

      res.status(200).json({
        message: 'Caso de prueba actualizado exitosamente.',
        casoPrueba: casoPruebaActualizado,
      });
    } catch (error) {
      console.error('Error al actualizar caso de prueba:', error.message);
      res.status(500).json({ message: 'Error al actualizar caso de prueba.' });
    }
  },

  // Eliminar un caso de prueba
  eliminarCasoPrueba: async (req, res) => {
    try {
      const { id } = req.params;
      const casoPrueba = await CasoPrueba.obtenerPorId(id);

      if (!casoPrueba) {
        return res.status(404).json({ message: 'Caso de prueba no encontrado.' });
      }

      await CasoPrueba.eliminarCasoPrueba(id);
      res.status(200).json({ message: 'Caso de prueba eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar caso de prueba:', error.message);
      res.status(500).json({ message: 'Error al eliminar caso de prueba.' });
    }
  },
};

module.exports = CasoPruebaController;
