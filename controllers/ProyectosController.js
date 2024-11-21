const Proyecto = require('../models/ProyectoModel');
 
// Crear proyecto
exports.crearProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.create(req.body);
        res.status(201).json(proyecto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll();
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Obtener un proyecto por ID
exports.obtenerProyectoPorId = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByPk(req.params.id);
        if (proyecto) {
            res.status(200).json(proyecto);
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Actualizar proyecto
exports.actualizarProyecto = async (req, res) => {
    try {
        await Proyecto.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: 'Proyecto actualizado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
// Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        await Proyecto.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Proyecto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};