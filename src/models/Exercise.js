const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    primaryMuscles: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one primary muscle is required'
      }
    },
    secondaryMuscles: {
      type: [String],
      default: []
    },
    equipment: {
      type: String,
      enum: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other'],
      default: 'other'
    },
    movementPattern: {
      type: String,
      enum: ['push', 'pull', 'squat', 'hinge', 'carry', 'core', 'other'],
      default: 'other'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      default: 'moderate'
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    substitutes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
      }
    ],
    isPublic: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

exerciseSchema.index({ name: 'text', primaryMuscles: 'text', secondaryMuscles: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);
