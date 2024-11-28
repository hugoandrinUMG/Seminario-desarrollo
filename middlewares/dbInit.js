const pool = require('../config/db');
 
async function inicializarBaseDeDatos() {
    try {
        // Verificar si la columna "estado" ya existe
        const checkQuery = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'proyectos' AND column_name = 'estado';
        `;
        const result = await pool.query(checkQuery);
 
        if (result.rows.length === 0) {
            // La columna no existe, agregarla
            const alterQuery = `
                ALTER TABLE proyectos ADD COLUMN estado VARCHAR(50) DEFAULT 'Pendiente';
            `;
            await pool.query(alterQuery);
            console.log('Columna "estado" añadida exitosamente.');
        } else {
            // La columna existe, verificar y cambiar el tamaño a 50
            const alterSizeQuery = `
                ALTER TABLE proyectos ALTER COLUMN estado TYPE VARCHAR(50);
            `;
            await pool.query(alterSizeQuery);
            console.log('Columna "estado" actualizada a VARCHAR(50).');
        }
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
    }
}
 
module.exports = inicializarBaseDeDatos;