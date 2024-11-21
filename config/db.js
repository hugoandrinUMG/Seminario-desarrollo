const { Pool } = require('pg');
require('dotenv').config();
 
// Verificar NODE_ENV
const environment = process.env.NODE_ENV || 'development';
console.log('Entorno leído desde NODE_ENV:', environment);

// switch de tipo de DB

//npm run start:dev
//npm run start:prod
 
// Selección de conexión según el entorno
let connectionString;
if (environment === 'production') {
    connectionString = process.env.DATABASE_URL_PROD;
    console.log('Conectando a la base de datos remota en producción:', connectionString);
} else {
    connectionString = process.env.DATABASE_URL_LOCAL;
    console.log('Conectando a la base de datos local en desarrollo:', connectionString);
}
 
// Configuración del Pool
const pool = new Pool({
    connectionString,
    ssl: environment === 'production' ? { rejectUnauthorized: false } : false,
});
 
// Probar conexión inicial
pool.query('SELECT current_database()', (err, res) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos:', res.rows[0].current_database);
    }
});


console.log('NODE_ENV actual:', process.env.NODE_ENV);
console.log('Conexión esperada:', connectionString);
 
module.exports = pool;