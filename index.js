const express = require('express');
//const cors = require('cors');
//const helmet = require('helmet');
//const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
require('dotenv').config();

// Importar rutas
const discountRoutes = require('./routes/discountsRoutes');
const productRoutes = require('./routes/productRoutes');

// Crear aplicación Express
const app = express();

// Configuración de middlewares globales
// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || '*', // Configurable desde .env
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Seguridad con Helmet
//app.use(helmet());

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 100, // Limitar cada IP a 100 solicitudes por ventana
//   message: 'Demasiadas solicitudes desde esta IP, por favor intente después de 15 minutos'
// });
// app.use(limiter);

// Middleware de registro de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas de la aplicación
app.use('/api/discounts', discountRoutes);
app.use('/api/products', productRoutes);

// Ruta raíz para verificar estado del servidor
app.get('/', (req, res) => {
  res.json({
    message: 'Discount Management API',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Autenticar conexión a base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida correctamente.');

    // Sincronizar modelos (opcional, usar con precaución en producción)
    // await sequelize.sync({ alter: true });
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

module.exports = app;
