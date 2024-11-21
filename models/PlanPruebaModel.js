const pool = require('../config/db');
 
const PlanPruebaModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM planes_prueba');
    return result.rows;
  },
 
  crearPlanPrueba: async ({ nombre, descripcion, id_proyecto }) => {
    const result = await pool.query(
      'INSERT INTO planes_prueba (nombre, descripcion, id_proyecto) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, id_proyecto]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM planes_prueba WHERE id = $1', [id]);
    return result.rows[0];
  },
 
  actualizarPlanPrueba: async (id, datos) => {
    const { nombre, descripcion, id_proyecto } = datos;
    const result = await pool.query(
      'UPDATE planes_prueba SET nombre = $1, descripcion = $2, id_proyecto = $3 WHERE id = $4 RETURNING *',
      [nombre, descripcion, id_proyecto, id]
    );
    return result.rows[0];
  },
 
  eliminarPlanPrueba: async (id) => {
    await pool.query('DELETE FROM planes_prueba WHERE id = $1', [id]);
  },
};
 
module.exports = PlanPruebaModel;