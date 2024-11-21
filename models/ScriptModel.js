const pool = require('../config/db');
 
const ScriptModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM scripts');
    return result.rows;
  },
 
  crearScript: async ({ id_proyecto, nombre, descripcion, contenido }) => {
    const result = await pool.query(
      `INSERT INTO scripts (id_proyecto, nombre, descripcion, contenido)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_proyecto, nombre, descripcion, contenido]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM scripts WHERE id = $1', [id]);
    return result.rows[0];
  },
  actualizarScript: async (id, datos) => {
    const { nombre, descripcion, contenido } = datos;
    const result = await pool.query(
      `UPDATE scripts 
       SET nombre = $1, descripcion = $2, contenido = $3 
       WHERE id = $4 RETURNING *`,
      [nombre, descripcion, contenido, id]
    );
    return result.rows[0];
  },
 
  eliminarScript: async (id) => {
    await pool.query('DELETE FROM scripts WHERE id = $1', [id]);
  },
};
 
module.exports = ScriptModel;