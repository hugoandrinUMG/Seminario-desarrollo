const Proyecto = require('../models/ProyectoModel');

exports.crearProyecto = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado } = req.body;
 
        if (typeof estado !== 'string') {
            return res.status(400).json({ message: 'El campo "estado" debe ser una cadena válida.' });
        }
 
        if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !id_usuario || !estado) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }
 
        const proyecto = await Proyecto.crearProyecto({ nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado });
        res.status(201).json(proyecto);
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        res.status(500).json({ message: 'Error al crear el proyecto.' });
    }
};

// Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.obtenerTodos();
        res.status(200).json(proyectos);
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        res.status(500).json({ message: 'Error al obtener los proyectos.' });
    }
};

// Obtener un proyecto por ID
exports.obtenerProyectoPorId = async (req, res) => {
    try {
        const proyecto = await Proyecto.obtenerPorId(req.params.id);
        if (proyecto) {
            res.status(200).json(proyecto);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener el proyecto por ID:', error);
        res.status(500).json({ message: 'Error al obtener el proyecto.' });
    }
};

// Actualizar proyecto
exports.actualizarProyecto = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado } = req.body;
 
        if (typeof estado !== 'string') {
            return res.status(400).json({ message: 'El campo "estado" debe ser una cadena válida.' });
        }
 
        if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !id_usuario || !estado) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }
 
        console.log('Datos que llegan al controlador para actualizar:', { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado }); // Log para depuración
 
        const proyectoActualizado = await Proyecto.actualizarProyecto(req.params.id, {
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            id_usuario,
            estado,
        });
 
        if (proyectoActualizado) {
            res.status(200).json(proyectoActualizado);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado para actualizar.' });
        }
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        res.status(500).json({ message: 'Error al actualizar el proyecto.' });
    }
};

// Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        await Proyecto.eliminarProyecto(req.params.id);
        res.status(200).json({ message: 'Proyecto eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ message: 'Error al eliminar el proyecto.' });
    }
};
