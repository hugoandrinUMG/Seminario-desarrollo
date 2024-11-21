const pool = require('../config/db');
 
const CasoPruebaModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM casos_prueba');
    return result.rows;
  },
 
  crearCasoPrueba: async ({ nombre, descripcion, id_proyecto }) => {
    const result = await pool.query(
      'INSERT INTO casos_prueba (nombre, descripcion, id_proyecto) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, id_proyecto]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM casos_prueba WHERE id = $1', [id]);
    return result.rows[0];
  },
 
  actualizarCasoPrueba: async (id, datos) => {
    const { nombre, descripcion, id_proyecto } = datos;
    const result = await pool.query(
      'UPDATE casos_prueba SET nombre = $1, descripcion = $2, id_proyecto = $3 WHERE id = $4 RETURNING *',
      [nombre, descripcion, id_proyecto, id]
    );
    return result.rows[0];
  },
 
  eliminarCasoPrueba: async (id) => {
    await pool.query('DELETE FROM casos_prueba WHERE id = $1', [id]);
  },
};
 
module.exports = CasoPruebaModel;