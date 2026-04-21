const { z } = require('zod');

const exerciseQuerySchema = z.object({
  q: z.string().max(100).optional(),
  muscle: z.string().max(60).optional(),
  equipment: z.enum(['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  page: z.coerce.number().int().min(1).optional().default(1)
});

const exerciseBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().max(1000).optional().default(''),
  primaryMuscles: z.array(z.string().min(1)).min(1),
  secondaryMuscles: z.array(z.string().min(1)).optional().default([]),
  equipment: z.enum(['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other']).optional().default('other'),
  movementPattern: z.enum(['push', 'pull', 'squat', 'hinge', 'carry', 'core', 'other']).optional().default('other'),
  difficulty: z.enum(['easy', 'moderate', 'hard']).optional().default('moderate'),
  visibility: z.enum(['public', 'private']).optional().default('public'),
  substitutes: z.array(z.string().min(1)).optional().default([])
});

const createExerciseSchema = exerciseBodySchema;
const updateExerciseSchema = exerciseBodySchema.partial();

module.exports = {
  exerciseQuerySchema,
  createExerciseSchema,
  updateExerciseSchema
};
