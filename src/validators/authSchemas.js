const { z } = require('zod');

const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
  bodyWeightKg: z.number().min(30).max(250).nullable().optional()
});

const loginSchema = z.object({
  email: z.string().trim().min(2).max(100),
  password: z.string().min(8).max(100)
});

const updateMeSchema = z.object({
  firstName: z.string().trim().min(2).max(60).optional(),
  lastName: z.string().trim().min(2).max(60).optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
  bodyWeightKg: z.number().min(30).max(250).nullable().optional(),
  password: z.string().min(8).max(100).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateMeSchema
};