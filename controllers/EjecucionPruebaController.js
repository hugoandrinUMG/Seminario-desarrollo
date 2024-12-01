const EjecucionPruebaModel = require('../models/EjecucionPruebaModel');

// Obtener todas las ejecuciones de prueba
const obtenerTodas = async (req, res) => {
  try {
    const ejecuciones = await EjecucionPruebaModel.obtenerTodas();
    res.status(200).json(ejecuciones);
  } catch (error) {
    console.error('Error al obtener ejecuciones de prueba:', error);
    res.status(500).json({ message: 'Error al obtener ejecuciones de prueba.' });
  }
};

// Crear una nueva ejecución de prueba
const crearEjecucionPrueba = async (req, res) => {
  try {
    const { id_caso_prueba, id_script, fecha_ejecucion, resultado, comentarios } = req.body;

    // Validar campos obligatorios
    if (!id_caso_prueba || !fecha_ejecucion || !resultado) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: id_caso_prueba, fecha_ejecucion y resultado.' });
    }

    // Crear la ejecución de prueba
    const nuevaEjecucion = await EjecucionPruebaModel.crearEjecucionPrueba({
      id_caso_prueba,
      id_script: id_script || null, // Maneja el caso donde no hay id_script
      fecha_ejecucion,
      resultado,
      comentarios: comentarios || 'Sin comentarios',
    });

    res.status(201).json(nuevaEjecucion);
  } catch (error) {
    console.error('Error al crear ejecución de prueba:', error); // Ver registro detallado
    res.status(500).json({ message: 'Error al crear ejecución de prueba.' });
  }
};



// Obtener una ejecución de prueba por ID
const obtenerPorId = async (req, res) => {
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
};

// Actualizar una ejecución de prueba
const actualizarEjecucionPrueba = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_caso_prueba, id_script, fecha_ejecucion, resultado, comentarios } = req.body;

    const ejecucionActualizada = await EjecucionPruebaModel.actualizarEjecucionPrueba(id, {
      id_caso_prueba,
      id_script,
      fecha_ejecucion,
      resultado,
      comentarios,
    });

    if (!ejecucionActualizada) {
      return res.status(404).json({ message: 'Ejecución de prueba no encontrada para actualizar.' });
    }

    res.status(200).json(ejecucionActualizada);
  } catch (error) {
    console.error('Error al actualizar ejecución de prueba:', error);
    res.status(500).json({ message: 'Error al actualizar ejecución de prueba.' });
  }
};

// Eliminar una ejecución de prueba
const eliminarEjecucionPrueba = async (req, res) => {
  try {
    const { id } = req.params;
    await EjecucionPruebaModel.eliminarEjecucionPrueba(id);
    res.status(200).json({ message: 'Ejecución de prueba eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar ejecución de prueba:', error);
    res.status(500).json({ message: 'Error al eliminar ejecución de prueba.' });
  }
};

module.exports = {
  crearEjecucionPrueba,
  obtenerPorId,
  actualizarEjecucionPrueba,
  eliminarEjecucionPrueba,
  obtenerTodas
};
