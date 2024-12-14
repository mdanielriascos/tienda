const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const conectarBDMongo = require('./src/configuracion/baseDatos');
const pool = require('./src/configuracion/baseDatosPostgres');
const middlewareAutenticacion = require('./src/middleware/middlewareAutenticacion');

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración específica de CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ["GET", "POST", "PUT", "DELETE"],// Permitir solicitudes solo desde el frontend
  credentials: true,              // Habilitar cookies o encabezados personalizados
}));

// Conexión a MongoDB y PostgreSQL
conectarBDMongo();

pool.connect().catch(err => console.error('Error al conectar a PostgreSQL:', err.message));

// Rutas
app.use('/api/productos', require('./src/rutas/rutasProducto'));
app.use('/api/usuarios', require('./src/rutas/rutasUsuario'));
app.use('/api/ordenes', require('./src/rutas/rutasOrden'));
app.use('/api/carrito', require('./src/rutas/rutasCarrito'));
app.use('/api/categorias', require('./src/rutas/rutasCategoria'));

// Ruta protegida de ejemplo
app.get('/api/usuarios/perfil', middlewareAutenticacion, (req, res) => {
  res.status(200).json({ mensaje: 'Perfil de usuario', usuario: req.user });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejo de errores en el servidor
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
