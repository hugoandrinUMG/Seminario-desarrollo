const pool = require('../config/db');

const ScriptModel = {
  obtenerTodos: async () => {
    const query = `
      SELECT 
        scripts.id, 
        scripts.id_proyecto, 
        proyectos.nombre AS nombre_proyecto, -- Obtener el nombre del proyecto
        scripts.nombre, 
        scripts.descripcion, 
        scripts.contenido, 
        scripts.estado, 
        scripts.id_usuario_creador,
        usuarios.nombre AS usuario_creador -- Obtener el nombre del usuario creador
      FROM scripts
      LEFT JOIN proyectos ON scripts.id_proyecto = proyectos.id
      LEFT JOIN usuarios ON scripts.id_usuario_creador = usuarios.id
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  crearScript: async ({ id_proyecto, nombre, descripcion, contenido, id_usuario_creador }) => {
    const query = `
      INSERT INTO scripts (id_proyecto, nombre, descripcion, contenido, id_usuario_creador, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      id_proyecto,
      nombre,
      descripcion,
      contenido,
      id_usuario_creador,
      'Primer version de codigo', // Estado inicial por defecto
    ]);
    return result.rows[0];
  },

  obtenerPorId: async (id) => {
    const query = `
      SELECT 
        scripts.id, 
        scripts.id_proyecto, 
        proyectos.nombre AS nombre_proyecto, 
        scripts.nombre, 
        scripts.descripcion, 
        scripts.contenido, 
        scripts.estado, 
        scripts.id_usuario_creador,
        usuarios.nombre AS usuario_creador 
      FROM scripts
      LEFT JOIN proyectos ON scripts.id_proyecto = proyectos.id
      LEFT JOIN usuarios ON scripts.id_usuario_creador = usuarios.id
      WHERE scripts.id = $1;
    `;
    const result = await pool.query(query, [id]);
    //return result.rows[0];

    if (result.rows.length === 0) {
      console.log('No se encontró el script con id:', id);
      return null;  // Si no se encuentra el script, retornamos null
    }
  
    console.log('Script encontrado:', result.rows[0]);  // Verifica que el campo 'contenido' esté presente
    return result.rows[0];

  },

  actualizarScript: async (id, datos) => {
    const { id_proyecto, id_usuario, nombre, descripcion, contenido } = datos;
    const result = await pool.query(
      `UPDATE scripts 
       SET id_proyecto = $1, id_usuario_creador = $2, nombre = $3, descripcion = $4, contenido = $5 
       WHERE id = $6 RETURNING *`,
      [id_proyecto, id_usuario, nombre, descripcion, contenido, id]
    );
    return result.rows[0];
  },

  eliminarScript: async (id) => {
    const result = await pool.query('DELETE FROM scripts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = ScriptModel;
