require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./config/db');
const casoPruebaRoutes = require('./routes/casoPrueba');
const defectoRoutes = require('./routes/defectos');
const documentoRoutes = require('./routes/documentos');
const ejecucionesPruebaRoutes = require('./routes/ejecucionesPrueba');
const historialDefectosRoutes = require('./routes/historialDefectos');
const planPruebasRoutes = require('./routes/planPruebas');
const reportesRoutes = require('./routes/reportes');
const scriptsRoutes = require('./routes/scripts');
const proyectosRoutes = require('./routes/proyectos');
const usuariosRoutes = require('./routes/usuarios');


// Middleware
app.use(express.json());
app.use(cors());

// Servir archivos estáticos
app.use(express.static('public'));

// Ruta raíz redirige al archivo home.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});
 
// Ruta de prueba
//app.get('/', (req, res) => {
//  res.send('Backend configurado correctamente');
//});

// Ruta de prueba para /api
app.get('/api', (req, res) => {
  res.send('Ruta /api funcionando');
});


// Cambia 'https://seminario-desarrollo-backend.onrender.com' por tu dominio si es diferente
app.use(cors({
  origin: 'https://seminario-desarrollo-backend.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Permite cookies si las usas
}));


// Importar y usar la ruta de usuariosconst usuariosRoutes = require('./routes/usuarios');
console.log('usuariosRoutes importado:', usuariosRoutes); // Línea de verificación
app.use('/api/usuarios', usuariosRoutes);

//Verificar que BD estamos usando
pool.query('SELECT current_database()', (err, res) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos:', res.rows[0].current_database);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log(`Entorno actual: ${process.env.NODE_ENV}`);
  //console.log(process.env.JWT_SECRET); // solo para test eliminar luego
});

// Ruta para servir reset_clave.html al acceder a /reset-password
app.get('/reset-password', (req, res) => {
  res.sendFile(__dirname + '/public/actualizar_clave.html');
});





// Usar las rutas de casos de prueba
app.use('/api/casos-prueba', casoPruebaRoutes);






// Usar las rutas para defectos
app.use('/api/defectos', defectoRoutes);





// Usar las rutas para documentos
app.use('/api/documentos', documentoRoutes);





// Usar las rutas para ejecuciones de prueba
app.use('/api/ejecuciones-prueba', ejecucionesPruebaRoutes);




// Usar las rutas para el historial de defectos
app.use('/api/historial-defectos', historialDefectosRoutes);





// Usar las rutas para los planes de prueba
app.use('/api/planes-prueba', planPruebasRoutes);






// Usar las rutas para los reportes
app.use('/api/reportes', reportesRoutes);







// Usar las rutas para los scripts
app.use('/api/scripts', scriptsRoutes);







// Usar las rutas para los proyectos
app.use('/api/proyectos', proyectosRoutes);
