const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('totalExercises', {
  ref: 'Exercise',
  localField: '_id',
  foreignField: 'createdBy',
  count: true
});

userSchema.virtual('activeRoutines', {
  ref: 'Routine',
  localField: '_id',
  foreignField: 'user',
  count: true
});

userSchema.virtual('sessionsCompleted', {
  ref: 'WorkoutSession',
  localField: '_id',
  foreignField: 'user',
  count: true,
  match: { status: 'completed' }
});

userSchema.virtual('friendsCount').get(function () {
  return this.friends ? this.friends.length : 0;
});

/**
 * Encripta la contraseña antes de guardar (insert o update)
 */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

/**
 * Encripta la contraseña para operaciones de actualización atómicas
 * Maneja: findOneAndUpdate, updateOne, updateMany, update
 */
userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany', 'update'], async function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 12);
    this.setUpdate(update);
  }
  else if (update.$set && update.$set.password) {
    update.$set.password = await bcrypt.hash(update.$set.password, 12);
    this.setUpdate(update);
  }

  return next();
});

/**
 * Compara contraseña en texto plano con hash almacenado
 */
userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

/**
 * Alias para comparePassword (nomenclatura alternativa)
 */
userSchema.methods.isCorrectPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
