const pool = require('../config/db');
 
const EjecucionPruebaModel = {
  obtenerTodas: async () => {
    const result = await pool.query('SELECT * FROM ejecuciones_prueba');
    return result.rows;
  },
 
  crearEjecucionPrueba: async ({ id_caso_prueba, id_plan_prueba, fecha_ejecucion, resultado, observaciones }) => {
    const result = await pool.query(
      `INSERT INTO ejecuciones_prueba (id_caso_prueba, id_plan_prueba, fecha_ejecucion, resultado, observaciones)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_caso_prueba, id_plan_prueba, fecha_ejecucion, resultado, observaciones]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM ejecuciones_prueba WHERE id = $1', [id]);
    return result.rows[0];
  },
 
  actualizarEjecucionPrueba: async (id, datos) => {
    const { id_caso_prueba, id_plan_prueba, fecha_ejecucion, resultado, observaciones } = datos;
    const result = await pool.query(
      `UPDATE ejecuciones_prueba 
       SET id_caso_prueba = $1, id_plan_prueba = $2, fecha_ejecucion = $3, resultado = $4, observaciones = $5 
       WHERE id = $6 RETURNING *`,
      [id_caso_prueba, id_plan_prueba, fecha_ejecucion, resultado, observaciones, id]
    );
    return result.rows[0];
  },
 
  eliminarEjecucionPrueba: async (id) => {
    await pool.query('DELETE FROM ejecuciones_prueba WHERE id = $1', [id]);
  },
};
 
module.exports = EjecucionPruebaModel;