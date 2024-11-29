const pool = require('../config/db');
 
async function inicializarBaseDeDatos() {
    try {
        // Verificar y agregar/actualizar la columna "estado" en la tabla "proyectos"
        const checkEstadoProyectos = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'proyectos' AND column_name = 'estado';
        `;
        const resultEstadoProyectos = await pool.query(checkEstadoProyectos);
 
        if (resultEstadoProyectos.rows.length === 0) {
            // La columna no existe, agregarla
            const alterEstadoProyectos = `
                ALTER TABLE proyectos ADD COLUMN estado VARCHAR(50) DEFAULT 'Pendiente';
            `;
            await pool.query(alterEstadoProyectos);
            console.log('Columna "estado" añadida a la tabla "proyectos".');
        } else {
            // La columna existe, verificar y cambiar el tamaño a 50
            const alterEstadoSizeProyectos = `
                ALTER TABLE proyectos ALTER COLUMN estado TYPE VARCHAR(50);
            `;
            await pool.query(alterEstadoSizeProyectos);
            console.log('Columna "estado" en la tabla "proyectos" actualizada a VARCHAR(50).');
        }
 
        // Verificar y agregar la columna "estado" en la tabla "scripts"
        const checkEstadoScripts = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'scripts' AND column_name = 'estado';
        `;
        const resultEstadoScripts = await pool.query(checkEstadoScripts);
 
        if (resultEstadoScripts.rows.length === 0) {
            const alterEstadoScripts = `
                ALTER TABLE scripts ADD COLUMN estado VARCHAR(50) DEFAULT 'Primer version de codigo';
            `;
            await pool.query(alterEstadoScripts);
            console.log('Columna "estado" añadida a la tabla "scripts".');
        } else {
            console.log('La columna "estado" ya existe en la tabla "scripts".');
        }
 
        // Verificar y agregar la columna "id_usuario_creador" en la tabla "scripts"
        const checkIdUsuarioCreador = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'scripts' AND column_name = 'id_usuario_creador';
        `;
        const resultIdUsuarioCreador = await pool.query(checkIdUsuarioCreador);
 
        if (resultIdUsuarioCreador.rows.length === 0) {
            const alterIdUsuarioCreador = `
                ALTER TABLE scripts ADD COLUMN id_usuario_creador INT REFERENCES usuarios(id);
            `;
            await pool.query(alterIdUsuarioCreador);
            console.log('Columna "id_usuario_creador" añadida a la tabla "scripts".');
        } else {
            console.log('La columna "id_usuario_creador" ya existe en la tabla "scripts".');
        }
 
        // Verificar y cambiar el tipo de la columna "contenido" en la tabla "scripts" a TEXT
        const checkContenidoScripts = `
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'scripts' AND column_name = 'contenido';
        `;
        const resultContenidoScripts = await pool.query(checkContenidoScripts);
 
        if (resultContenidoScripts.rows.length > 0 && resultContenidoScripts.rows[0].data_type !== 'text') {
            const alterContenidoScripts = `
                ALTER TABLE scripts ALTER COLUMN contenido TYPE TEXT;
            `;
            await pool.query(alterContenidoScripts);
            console.log('Columna "contenido" en la tabla "scripts" actualizada a tipo TEXT.');
        } else {
            console.log('La columna "contenido" ya es de tipo TEXT o no existe en la tabla "scripts".');
        }
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
    }
}
 
module.exports = inicializarBaseDeDatos;