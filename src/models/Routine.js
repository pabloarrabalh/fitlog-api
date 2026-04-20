const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    name: {
      type: String,
      required: [true, 'El nombre de la rutina es obligatorio'],
    },
    description: {
      type: String,
      default: '',
    },
    exercises: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true,
        },
        sets: {
          type: Number,
          required: [true, 'El número de series es obligatorio'],
          min: 1,
        },
        reps: {
          type: Number,
          required: [true, 'El número de repeticiones es obligatorio'],
          min: 1,
        },
        weight: {
          type: Number,
          default: 0,
          min: 0,
        },
        restSeconds: {
          type: Number,
          default: 60,
          min: 0,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Routine', routineSchema);
