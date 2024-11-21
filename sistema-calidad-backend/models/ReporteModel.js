const pool = require('../config/db');
 
const ReporteModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM reportes');
    return result.rows;
  },
 
  crearReporte: async ({ id_proyecto, titulo, contenido, fecha_generacion }) => {
    const result = await pool.query(
      `INSERT INTO reportes (id_proyecto, titulo, contenido, fecha_generacion)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_proyecto, titulo, contenido, fecha_generacion]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM reportes WHERE id = $1', [id]);
    return result.rows[0];
  },
  actualizarReporte: async (id, datos) => {
    const { titulo, contenido, fecha_generacion } = datos;
    const result = await pool.query(
      `UPDATE reportes 
       SET titulo = $1, contenido = $2, fecha_generacion = $3 
       WHERE id = $4 RETURNING *`,
      [titulo, contenido, fecha_generacion, id]
    );
    return result.rows[0];
  },
 
  eliminarReporte: async (id) => {
    await pool.query('DELETE FROM reportes WHERE id = $1', [id]);
  },
};
 
module.exports = ReporteModel;