const pool = require('../config/db');
 
const DocumentoModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM documentos');
    return result.rows;
  },
 
  crearDocumento: async ({ id_proyecto, nombre, tipo, ruta, fecha_subida }) => {
    const result = await pool.query(
      `INSERT INTO documentos (id_proyecto, nombre, tipo, ruta, fecha_subida)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_proyecto, nombre, tipo, ruta, fecha_subida]
    );
    return result.rows[0];
  },
 
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM documentos WHERE id = $1', [id]);
    return result.rows[0];
  },
  actualizarDocumento: async (id, datos) => {
    const { nombre, tipo, ruta, fecha_subida } = datos;
    const result = await pool.query(
      `UPDATE documentos 
       SET nombre = $1, tipo = $2, ruta = $3, fecha_subida = $4 
       WHERE id = $5 RETURNING *`,
      [nombre, tipo, ruta, fecha_subida, id]
    );
    return result.rows[0];
  },
 
  eliminarDocumento: async (id) => {
    await pool.query('DELETE FROM documentos WHERE id = $1', [id]);
  },
};
 
module.exports = DocumentoModel;