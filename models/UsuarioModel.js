const pool = require('../config/db');
 
const UsuarioModel = {
  obtenerTodos: async () => {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
  },
  crearUsuario: async ({ nombre, email, rol, contrasena }) => {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, rol, contrasena) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, rol, contrasena]
    );
    return result.rows[0];
  },
  obtenerPorId: async (id) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  },


  actualizarUsuario: async (id, datos) => {
    const { nombre, email, rol, contrasena } = datos;
 
    // Construir consulta dinámica para excluir la contraseña si no se proporciona
    const queryParts = [];
    const queryValues = [id];
 
    if (nombre) {
        queryParts.push(`nombre = $${queryValues.length + 1}`);
        queryValues.push(nombre);
    }
    if (email) {
        queryParts.push(`email = $${queryValues.length + 1}`);
        queryValues.push(email);
    }
    if (rol) {
        queryParts.push(`rol = $${queryValues.length + 1}`);
        queryValues.push(rol);
    }
    if (contrasena) {
        queryParts.push(`contrasena = $${queryValues.length + 1}`);
        queryValues.push(contrasena);
    }
 
    const query = `
        UPDATE usuarios
        SET ${queryParts.join(', ')}
        WHERE id = $1
        RETURNING *;
    `;
 
    const result = await pool.query(query, queryValues);
    return result.rows[0];
},


  eliminarUsuario: async (id) => {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  },
  obtenerPorEmail: async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
  },
  obtenerPorNombre: async (nombre) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE nombre = $1', [nombre]);
    return result.rows[0];
},

guardarTokenRestablecimiento: async (id, token, expiracion) => {
  await pool.query(
  'UPDATE usuarios SET token_restablecimiento = $1, expiracion_token = $2 WHERE id = $3',
        [token, expiracion, id]
      );
    },
   
    /**    
     *Obtener un usuario por su token de restablecimiento.   
     * @param {string} token - El token de restablecimiento.    
     * @returns {Promise<object|null>} - Usuario si se encuentra, null si no. 
     */
    
     obtenerPorToken: async (token) => {
  try {
  const result = await pool.query(
  'SELECT * FROM usuarios WHERE token_restablecimiento = $1 AND expiracion_token > NOW()',
          [token]
        );
  return result.rows[0] || null; // Retorna null si no hay resultados
      } catch (error) {
        console.error('Error al buscar usuario por token:', error);
  throw error; // Lanzar el error para manejarlo en el controlador
      }
    },
   
    actualizarContrasena: async (id, contrasena) => {
  await pool.query('UPDATE usuarios SET contrasena = $1 WHERE id = $2', [contrasena, id]);
    },
   
    eliminarTokenRestablecimiento: async (id) => {
  await pool.query(
  'UPDATE usuarios SET token_restablecimiento = NULL, expiracion_token = NULL WHERE id = $1',
        [id]
      );
    },


};
 
module.exports = UsuarioModel;

