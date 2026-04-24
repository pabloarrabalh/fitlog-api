const { z } = require('zod');

const adHocExerciseSchema = z
  .object({
    exercise: z.string().min(1),
    order: z.number().int().positive(),
    plannedSets: z.number().int().min(1).max(20),
    plannedRepsMin: z.number().int().min(1).max(50),
    plannedRepsMax: z.number().int().min(1).max(50),
    plannedWeightKg: z.number().min(0).max(700).optional(),
    restSeconds: z.number().int().min(10).max(600).optional(),
    notes: z.string().max(300).optional()
  })
  .refine((data) => data.plannedRepsMin <= data.plannedRepsMax, {
    message: 'plannedRepsMin cannot be greater than plannedRepsMax',
    path: ['plannedRepsMin']
  });

const startSessionSchema = z
  .object({
    routineId: z.string().optional(),
    objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
    notes: z.string().max(500).optional(),
    exercises: z.array(adHocExerciseSchema).max(40).optional()
  })
  .refine((data) => Boolean(data.routineId) || (Array.isArray(data.exercises) && data.exercises.length > 0), {
    message: 'Provide routineId or at least one ad-hoc exercise',
    path: ['routineId']
  });

const updateSessionSchema = z.object({
  notes: z.string().max(500).optional(),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional()
});

const addSetSchema = z.object({
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(1).max(100),
  weightKg: z.number().min(0).max(700),
  restSeconds: z.number().int().min(0).max(1200).optional(),
  rpe: z.number().min(1).max(10).optional(),
  completed: z.boolean().optional()
});

const completeSessionSchema = z.object({
  notes: z.string().max(500).optional()
});

module.exports = {
  startSessionSchema,
  updateSessionSchema,
  addSetSchema,
  completeSessionSchema
};
