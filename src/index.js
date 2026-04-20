require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();

app.use(express.json());

connectDB();

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Algo salió mal en el servidor';

  res.status(statusCode).json({
    success: false,
    message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

module.exports = app;
