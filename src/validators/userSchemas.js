const { z } = require('zod');

const userSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.string().email(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
  bodyWeightKg: z.number().min(30).max(250).nullable().optional()
});

const createUserSchema = userSchema;
const updateUserSchema = userSchema.partial();

module.exports = {
  createUserSchema,
  updateUserSchema
};