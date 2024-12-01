const pool = require('../config/db');

const CasoPruebaModel = {
    obtenerTodos: async () => {
        const result = await pool.query(`
          SELECT 
            cp.id, 
            cp.nombre AS nombre, -- Asegúrate de asignar el alias
            cp.descripcion, 
            cp.pasos, 
            cp.resultado_esperado,
            p.nombre AS nombre_proyecto,
            s.nombre AS nombre_script,
            u.nombre AS nombre_usuario
          FROM casos_prueba cp
          LEFT JOIN proyectos p ON cp.id_proyecto = p.id
          LEFT JOIN scripts s ON cp.id_script = s.id
          LEFT JOIN usuarios u ON cp.id_usuario = u.id;
        `);
    
        console.log('Resultados de la consulta:', result.rows); // Log para validar
        return result.rows;
    },
    

    crearCasoPrueba: async ({ id_proyecto, id_script, id_usuario, nombre, descripcion, pasos, resultado_esperado }) => {
        const result = await pool.query(
            `INSERT INTO casos_prueba 
            (id_proyecto, id_script, id_usuario, nombre, descripcion, pasos, resultado_esperado) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id_proyecto, id_script, id_usuario, nombre, descripcion, pasos, resultado_esperado]
        );
        return result.rows[0];
    },

    obtenerPorId: async (id) => {
      const result = await pool.query(`
          SELECT 
              cp.id, 
              cp.nombre, 
              cp.descripcion, 
              cp.pasos, 
              cp.resultado_esperado, 
              p.nombre AS nombre_proyecto, 
              s.nombre AS nombre_script, 
              u.nombre AS nombre_usuario
          FROM casos_prueba cp
          LEFT JOIN proyectos p ON cp.id_proyecto = p.id
          LEFT JOIN scripts s ON cp.id_script = s.id
          LEFT JOIN usuarios u ON cp.id_usuario = u.id
          WHERE cp.id = $1;
      `, [id]);
  
      console.log('Caso de prueba obtenido:', result.rows[0]); // Log para depuración
      return result.rows[0];
  },
  

    actualizarCasoPrueba: async (id, datos) => {
        const { id_proyecto, id_script, id_usuario, nombre, descripcion, pasos, resultado_esperado } = datos;
    
        console.log('Datos a actualizar en la base de datos:', datos);
    
        const result = await pool.query(
          `
          UPDATE casos_prueba
          SET 
            id_proyecto = $1,
            id_script = $2,
            id_usuario = $3,
            nombre = $4,
            descripcion = $5,
            pasos = $6,
            resultado_esperado = $7
          WHERE id = $8
          RETURNING *;
          `,
          [id_proyecto, id_script, id_usuario, nombre, descripcion, pasos, resultado_esperado, id]
        );
    
        return result.rows[0];
      },

    eliminarCasoPrueba: async (id) => {
        await pool.query('DELETE FROM casos_prueba WHERE id = $1', [id]);
    },
};

module.exports = CasoPruebaModel;
