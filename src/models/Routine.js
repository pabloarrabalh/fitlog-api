const mongoose = require('mongoose');

const routineExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    order: {
      type: Number,
      required: true,
      min: 1
    },
    targetSets: {
      type: Number,
      min: 1,
      max: 20,
      required: true
    },
    targetRepsMin: {
      type: Number,
      min: 1,
      max: 50,
      required: true
    },
    targetRepsMax: {
      type: Number,
      min: 1,
      max: 50,
      required: true
    },
    targetWeightKg: {
      type: Number,
      min: 0,
      max: 700,
      default: 0
    },
    restSeconds: {
      type: Number,
      min: 10,
      max: 600,
      default: 90
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { _id: true }
);

const routineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    objective: {
      type: String,
      enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'],
      default: 'hypertrophy'
    },
    description: {
      type: String,
      default: ''
    },
    exercises: {
      type: [routineExerciseSchema],
      default: []
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Routine', routineSchema);
