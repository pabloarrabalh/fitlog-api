const { z } = require('zod');

const routineExerciseSchema = z
  .object({
    exercise: z.string().min(1),
    order: z.number().int().positive(),
    targetSets: z.number().int().min(1).max(20),
    targetRepsMin: z.number().int().min(1).max(50),
    targetRepsMax: z.number().int().min(1).max(50),
    targetWeightKg: z.number().min(0).max(700).optional(),
    restSeconds: z.number().int().min(10).max(600).optional(),
    notes: z.string().max(300).optional()
  })
  .refine((data) => data.targetRepsMin <= data.targetRepsMax, {
    message: 'targetRepsMin cannot be greater than targetRepsMax',
    path: ['targetRepsMin']
  });

const createRoutineSchema = z.object({
  name: z.string().trim().min(2).max(100),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
  description: z.string().max(400).optional(),
  exercises: z.array(routineExerciseSchema).max(40).optional().default([])
});

const updateRoutineSchema = createRoutineSchema.partial();

module.exports = {
  createRoutineSchema,
  updateRoutineSchema
};
