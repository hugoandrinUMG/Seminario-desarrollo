const pool = require('../config/db');
 
const ScriptModel = {
  obtenerTodos: async () => {
    const result = await pool.query(`
      SELECT 
        s.*, 
        p.nombre AS nombre_proyecto, 
        u.nombre AS nombre_usuario 
      FROM scripts s
      JOIN proyectos p ON s.id_proyecto = p.id
      JOIN usuarios u ON s.id_usuario_creador = u.id
    `);
    return result.rows;
  },
  crearScript: async ({ id_proyecto, nombre, descripcion, contenido, estado, id_usuario_creador }) => {
    const result = await pool.query(
      `INSERT INTO scripts (id_proyecto, nombre, descripcion, contenido, estado, id_usuario_creador)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_proyecto, nombre, descripcion, contenido, estado, id_usuario_creador]
    );
    return result.rows[0];
  },
  obtenerPorId: async (id) => {
    const result = await pool.query(`
      SELECT 
        s.*, 
        p.nombre AS nombre_proyecto, 
        u.nombre AS nombre_usuario 
      FROM scripts s
      JOIN proyectos p ON s.id_proyecto = p.id
      JOIN usuarios u ON s.id_usuario_creador = u.id
      WHERE s.id = $1
    `, [id]);
    return result.rows[0];
  },
  actualizarScript: async (id, datos) => {
    const { nombre, descripcion, contenido, estado } = datos;
    const result = await pool.query(
      `UPDATE scripts 
       SET nombre = $1, descripcion = $2, contenido = $3, estado = $4 
       WHERE id = $5 RETURNING *`,
      [nombre, descripcion, contenido, estado, id]
    );
    return result.rows[0];
  },
  eliminarScript: async (id) => {
    await pool.query('DELETE FROM scripts WHERE id = $1', [id]);
  },
};
 
module.exports = ScriptModel;