const pool = require('../config/db');
 
const DefectoModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM defectos');
    return result.rows;
  },
 
  crearDefecto: async ({ id_ejecucion, descripcion, severidad, estado, fecha_creacion, fecha_resolucion }) => {
    const result = await pool.query(
      `INSERT INTO defectos (id_ejecucion, descripcion, severidad, estado, fecha_creacion, fecha_resolucion)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_ejecucion, descripcion, severidad, estado, fecha_creacion, fecha_resolucion]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM defectos WHERE id = $1', [id]);
    return result.rows[0];
  },
 
  actualizarDefecto: async (id, datos) => {
    const { id_ejecucion, descripcion, severidad, estado, fecha_creacion, fecha_resolucion } = datos;
    const result = await pool.query(
      `UPDATE defectos 
       SET id_ejecucion = $1, descripcion = $2, severidad = $3, estado = $4, fecha_creacion = $5, fecha_resolucion = $6 
       WHERE id = $7 RETURNING *`,
      [id_ejecucion, descripcion, severidad, estado, fecha_creacion, fecha_resolucion, id]
    );
    return result.rows[0];
  },
 
  eliminarDefecto: async (id) => {
    await pool.query('DELETE FROM defectos WHERE id = $1', [id]);
  },
};
 
module.exports = DefectoModel;