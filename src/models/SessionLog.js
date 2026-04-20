const mongoose = require('mongoose');

const sessionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    routine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Routine',
      required: [true, 'La rutina es obligatoria'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true,
        },
        sets: [
          {
            setNumber: Number,
            reps: {
              type: Number,
              required: true,
              min: 0,
            },
            weight: {
              type: Number,
              required: true,
              min: 0,
            },
            notes: String,
          },
        ],
      },
    ],
    totalVolume: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SessionLog', sessionLogSchema);
