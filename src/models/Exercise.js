const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del ejercicio es obligatorio'],
      trim: true,
    },
    muscleGroup: {
      type: String,
      required: [true, 'El grupo muscular es obligatorio'],
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
