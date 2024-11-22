require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./config/db');

// Importar las rutas de usuarios
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
