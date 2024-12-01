const pool = require('../config/db');

const EjecucionPruebaModel = {
  // Obtener todas las ejecuciones de prueba con el contenido del script
  obtenerTodas: async () => {
    const result = await pool.query('SELECT * FROM ejecuciones_prueba');
    return result.rows;
  },

  // Crear una nueva ejecución de prueba
  crearEjecucionPrueba: async ({ id_caso_prueba, id_script, fecha_ejecucion, resultado, comentarios }) => {
    const result = await pool.query(
      `INSERT INTO ejecuciones_prueba (id_caso_prueba, id_script, fecha_ejecucion, resultado, comentarios) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_caso_prueba, id_script, fecha_ejecucion, resultado, comentarios]
    );
    return result.rows[0];
  },
   
  // Actualizar una ejecución de prueba
  actualizarEjecucionPrueba: async (id, datos) => {
    const { id_caso_prueba, id_script, fecha_ejecucion, resultado, comentarios } = datos;
    const result = await pool.query(
      `UPDATE ejecuciones_prueba 
       SET id_caso_prueba = $1, id_script = $2, fecha_ejecucion = $3, resultado = $4, comentarios = $5 
       WHERE id = $6 RETURNING *`,
      [id_caso_prueba, id_script, fecha_ejecucion, resultado, comentarios, id]
    );
    return result.rows[0];
  },

 // Obtener una ejecución de prueba por ID, incluyendo el script y caso de prueba
 obtenerPorId: async (id) => {
  const query = `
    SELECT 
      ejecuciones_prueba.id,
      ejecuciones_prueba.fecha_ejecucion,
      ejecuciones_prueba.resultado,
      ejecuciones_prueba.comentarios,
      scripts.nombre AS nombre_script,
      casos_prueba.nombre AS nombre_caso_prueba
    FROM 
      ejecuciones_prueba
    LEFT JOIN 
      scripts ON ejecuciones_prueba.id_script = scripts.id
    LEFT JOIN 
      casos_prueba ON ejecuciones_prueba.id_caso_prueba = casos_prueba.id
    WHERE 
      ejecuciones_prueba.id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
},

  

  // Eliminar una ejecución de prueba por ID
  eliminarEjecucionPrueba: async (id) => {
    await pool.query('DELETE FROM ejecuciones_prueba WHERE id = $1', [id]);
  },
};

module.exports = EjecucionPruebaModel;
