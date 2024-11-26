const jwt = require('jsonwebtoken');
const pool = require('../config/db');
 
const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
 
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
    }
 
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Añadir información del usuario al request
      next();
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(403).json({ message: 'Token inválido o expirado' });
    }
  },
 
  verifyRole: (rolesPermitidos) => {
    return async (req, res, next) => {
      try {
        const { id } = req.user;
 
        // Consulta al usuario por su ID para obtener el rol
        const result = await pool.query('SELECT rol FROM usuarios WHERE id = $1', [id]);
        const usuario = result.rows[0];
 
        if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
          return res.status(403).json({ message: 'Acceso denegado: Rol no autorizado' });
        }
 
        next(); // Si el rol está permitido, continuar con la petición
      } catch (error) {
        console.error('Error al verificar el rol:', error);
        res.status(500).json({ message: 'Error interno al verificar el rol' });
      }
    };
  },
};
 
module.exports = authMiddleware;