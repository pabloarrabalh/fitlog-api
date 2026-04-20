const mongoose = require('mongoose');

const performedSetSchema = new mongoose.Schema(
  {
    setNumber: {
      type: Number,
      min: 1,
      required: true
    },
    reps: {
      type: Number,
      min: 1,
      max: 100,
      required: true
    },
    weightKg: {
      type: Number,
      min: 0,
      max: 700,
      required: true
    },
    restSeconds: {
      type: Number,
      min: 0,
      max: 1200,
      default: 0
    },
    rpe: {
      type: Number,
      min: 1,
      max: 10,
      default: null
    },
    completed: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);

const entrySchema = new mongoose.Schema(
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
    plannedSets: {
      type: Number,
      min: 1,
      max: 20,
      required: true
    },
    plannedRepsMin: {
      type: Number,
      min: 1,
      max: 50,
      required: true
    },
    plannedRepsMax: {
      type: Number,
      min: 1,
      max: 50,
      required: true
    },
    plannedWeightKg: {
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
    },
    previousPerformance: {
      date: { type: Date, default: null },
      sets: [
        {
          setNumber: Number,
          reps: Number,
          weightKg: Number
        }
      ]
    },
    performedSets: {
      type: [performedSetSchema],
      default: []
    }
  },
  { _id: true }
);

const workoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    routine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Routine',
      default: null
    },
    objective: {
      type: String,
      enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'],
      required: true
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress'
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    entries: {
      type: [entrySchema],
      default: []
    },
    totalVolumeKg: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

workoutSessionSchema.index({ user: 1, startedAt: -1 });

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
