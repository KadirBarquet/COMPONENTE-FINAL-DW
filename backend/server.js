import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studentSurveyRoutes from './routes/studentSurveyRoutes.js';
import teacherSurveyRoutes from './routes/teacherSurveyRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API de Chatbots Education Survey',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Ruta para verificar conexión a BD
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    const dbTernary = dbConnected ? 'conectada' : 'desconectada';
    res.json({
      status: 'OK',
      database: dbTernary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/student-surveys', studentSurveyRoutes);
app.use('/api/teacher-surveys', teacherSurveyRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a BD
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('Servidor iniciado sin conexión a BD');
    }
    
    const dbTernary = dbConnected ? 'conectada' : 'desconectada';

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║      SERVIDOR CORRIENDO               ║
║      Puerto: ${PORT}                     ║
║      URL: http://localhost:${PORT}       ║
║      Base de datos: ${dbTernary}         ║
║      ${new Date().toLocaleString()}             ║
╚═══════════════════════════════════════╝

  Endpoints disponibles:
   - POST   /api/auth/register
   - POST   /api/auth/login
   - GET    /api/auth/profile
   - GET    /api/users
   - GET    /api/users/:id
   - POST   /api/users
   - PUT    /api/users/:id
   - DELETE /api/users/:id
   - GET    /api/student-surveys
   - GET    /api/student-surveys/:id
   - POST   /api/student-surveys
   - PUT    /api/student-surveys/:id
   - DELETE /api/student-surveys/:id
   - GET    /api/teacher-surveys
   - GET    /api/teacher-surveys/:id
   - POST   /api/teacher-surveys
   - PUT    /api/teacher-surveys/:id
   - DELETE /api/teacher-surveys/:id
   - GET    /api/health
      `);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;

/*
╔═══════════════════════════════════════╗
║      SERVIDOR CORRIENDO               ║
║      Puerto: ${PORT}                     ║
║      URL: http://localhost:${PORT}       ║
║      Base de datos: ${dbTernary}         ║
║      ${new Date().toLocaleString()}             ║
╚═══════════════════════════════════════╝
*/