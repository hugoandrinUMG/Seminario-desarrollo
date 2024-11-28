const pool = require('../config/db');
 
const ProyectoModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM proyectos');
    return result.rows;
  },
 
  crearProyecto: async ({ nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado }) => {
    const result = await pool.query(
      'INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    return result.rows[0];
  },
 
  actualizarProyecto: async (id, datos) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado } = datos;
    const result = await pool.query(
      // Eliminar la coma extra antes de WHERE
      'UPDATE proyectos SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4, id_usuario = $5, estado = $6 WHERE id = $7 RETURNING *',
      [nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado, id]
    );
    return result.rows[0];
  },
 
  eliminarProyecto: async (id) => {
    await pool.query('DELETE FROM proyectos WHERE id = $1', [id]);
  },
};
 
module.exports = ProyectoModel;