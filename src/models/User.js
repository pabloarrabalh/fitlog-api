const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      minlength: 3,
      maxlength: 30
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    objective: {
      type: String,
      enum: ['strength', 'hypertrophy', 'endurance', 'recomposition'],
      default: 'hypertrophy'
    },
    bodyWeightKg: {
      type: Number,
      min: 30,
      max: 250,
      default: null
    },
    profileCompleted: {
      type: Boolean,
      default: false
    },
    friends: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return require('bcryptjs').compare(plainPassword, this.password);
};

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

module.exports = mongoose.model('User', userSchema);
