require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(express.json());

connectDB();

app.get('/api/health', (req, res) => {
  res.json({ status: 'API funcionando correctamente' });
});

// TODO: Descomentar cuando esté implementado el CRUD
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/routines', require('./routes/routineRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
