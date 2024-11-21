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
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, rol = $3, contrasena = $4 WHERE id = $5 RETURNING *',
      [nombre, email, rol, contrasena, id]
    );
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
  await pool.query('UPDATE usuarios SET token_restablecimiento = $1, expiracion_token = $2 WHERE id = $3', [token, expiracion, id]);
},

obtenerPorToken: async (token) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE token_restablecimiento = $1', [token]);
  return result.rows[0];
},

actualizarContrasena: async (id, contrasena) => {
  await pool.query('UPDATE usuarios SET contrasena = $1 WHERE id = $2', [contrasena, id]);
},

eliminarTokenRestablecimiento: async (id) => {
  await pool.query('UPDATE usuarios SET token_restablecimiento = NULL, expiracion_token = NULL WHERE id = $1', [id]);
},


};
 
module.exports = UsuarioModel;

