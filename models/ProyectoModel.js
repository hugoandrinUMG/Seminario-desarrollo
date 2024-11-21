const pool = require('../config/db');
 
const ProyectoModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM proyectos');
    return result.rows;
  },
 
  crearProyecto: async ({ nombre, descripcion, fecha_inicio, fecha_fin, id_usuario }) => {
    const result = await pool.query(
      'INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, fecha_inicio, fecha_fin, id_usuario]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    return result.rows[0];
  },
 
  actualizarProyecto: async (id, datos) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario } = datos;
    const result = await pool.query(
      'UPDATE proyectos SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4, id_usuario = $5 WHERE id = $6 RETURNING *',
      [nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, id]
    );
    return result.rows[0];
  },
 
  eliminarProyecto: async (id) => {
    await pool.query('DELETE FROM proyectos WHERE id = $1', [id]);
  },
};
 
module.exports = ProyectoModel;