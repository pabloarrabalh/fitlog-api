require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const seedExercises = require('../scripts/seedExercises');
const seedUsers = require('../scripts/seedUsers');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fitlog API is running',
    endpoints: {
      health: '/api/health',
      exercises: '/api/exercises',
      auth: '/api/auth',
      users: '/api/users',
      routines: '/api/routines',
      sessions: '/api/sessions',
      social: '/api/social'
    }
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedExercises();
  } catch (error) {
    console.error('MongoDB no está disponible. La API seguirá levantada, pero las rutas que dependen de la base de datos fallarán hasta que la conexión se restablezca.');
  }

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
};

startServer();

module.exports = app;
