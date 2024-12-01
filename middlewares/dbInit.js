const pool = require('../config/db');

async function inicializarBaseDeDatos() {
    try {
        // Verificar y agregar la columna "id_script" en la tabla "casos_prueba"
        const checkIdScript = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'casos_prueba' AND column_name = 'id_script';
        `;
        const resultIdScript = await pool.query(checkIdScript);

        if (resultIdScript.rows.length === 0) {
            const alterIdScript = `
                ALTER TABLE casos_prueba
                ADD COLUMN id_script INT REFERENCES scripts(id) ON DELETE SET NULL;
            `;
            await pool.query(alterIdScript);
            console.log('Columna "id_script" añadida a la tabla "casos_prueba".');
        } else {
            console.log('La columna "id_script" ya existe en la tabla "casos_prueba".');
        }

        // Verificar y agregar la columna "id_usuario" en la tabla "casos_prueba"
        const checkIdUsuario = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'casos_prueba' AND column_name = 'id_usuario';
        `;
        const resultIdUsuario = await pool.query(checkIdUsuario);

        if (resultIdUsuario.rows.length === 0) {
            const alterIdUsuario = `
                ALTER TABLE casos_prueba
                ADD COLUMN id_usuario INT REFERENCES usuarios(id) ON DELETE SET NULL;
            `;
            await pool.query(alterIdUsuario);
            console.log('Columna "id_usuario" añadida a la tabla "casos_prueba".');
        } else {
            console.log('La columna "id_usuario" ya existe en la tabla "casos_prueba".');
        }

        // Verificar y agregar la columna "pasos" en la tabla "casos_prueba"
        const checkPasos = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'casos_prueba' AND column_name = 'pasos';
        `;
        const resultPasos = await pool.query(checkPasos);

        if (resultPasos.rows.length === 0) {
            const alterPasos = `
                ALTER TABLE casos_prueba
                ADD COLUMN pasos TEXT;
            `;
            await pool.query(alterPasos);
            console.log('Columna "pasos" añadida a la tabla "casos_prueba".');
        } else {
            console.log('La columna "pasos" ya existe en la tabla "casos_prueba".');
        }

        // Verificar y agregar la columna "resultado_esperado" en la tabla "casos_prueba"
        const checkResultadoEsperado = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'casos_prueba' AND column_name = 'resultado_esperado';
        `;
        const resultResultadoEsperado = await pool.query(checkResultadoEsperado);

        if (resultResultadoEsperado.rows.length === 0) {
            const alterResultadoEsperado = `
                ALTER TABLE casos_prueba
                ADD COLUMN resultado_esperado TEXT;
            `;
            await pool.query(alterResultadoEsperado);
            console.log('Columna "resultado_esperado" añadida a la tabla "casos_prueba".');
        } else {
            console.log('La columna "resultado_esperado" ya existe en la tabla "casos_prueba".');
        }

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
    }
}

module.exports = inicializarBaseDeDatos;
