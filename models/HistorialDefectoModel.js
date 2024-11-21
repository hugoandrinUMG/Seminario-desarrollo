const pool = require('../config/db');
 
const HistorialDefectoModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM historial_defectos');
    return result.rows;
  },
 
  crearHistorial: async ({ id_defecto, estado, fecha_cambio, comentarios }) => {
    const result = await pool.query(
      `INSERT INTO historial_defectos (id_defecto, estado, fecha_cambio, comentarios)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_defecto, estado, fecha_cambio, comentarios]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM historial_defectos WHERE id = $1', [id]);
    return result.rows[0];
  },
  actualizarHistorial: async (id, datos) => {
    const { estado, fecha_cambio, comentarios } = datos;
    const result = await pool.query(
      `UPDATE historial_defectos 
       SET estado = $1, fecha_cambio = $2, comentarios = $3 
       WHERE id = $4 RETURNING *`,
      [estado, fecha_cambio, comentarios, id]
    );
    return result.rows[0];
  },
 
  eliminarHistorial: async (id) => {
    await pool.query('DELETE FROM historial_defectos WHERE id = $1', [id]);
  },
};
 
module.exports = HistorialDefectoModel;