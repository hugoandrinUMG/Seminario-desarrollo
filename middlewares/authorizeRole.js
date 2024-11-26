const jwt = require('jsonwebtoken');
 
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(403).json({ message: 'Token no proporcionado' });
 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.rol !== requiredRole) {
                return res.status(403).json({ message: 'No autorizado para este módulo' });
            }
 
            req.user = decoded; // Adjuntar el usuario al objeto de la solicitud
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token inválido o expirado' });
        }
    };
};
 
module.exports = authorizeRole;