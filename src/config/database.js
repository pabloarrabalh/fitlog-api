const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitlog';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    console.log('MongoDB conectado exitosamente');
    return true;
  } catch (error) {
    console.error(`Error al conectar MongoDB en ${mongoUri}: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
