require('dotenv').config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const seedExercises = require('../scripts/seedExercises');
const seedUsers = require('../scripts/seedUsers');
const openapiSpec = require('./docs/openapi');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api-docs.json', (req, res) => {
  res.json(openapiSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
  swaggerOptions: {
    docExpansion: 'none',
    persistAuthorization: true
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
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
