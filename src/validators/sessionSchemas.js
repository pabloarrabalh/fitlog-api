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

const startSessionSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  routineId: z.string().optional(),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
  notes: z.string().max(500).optional(),
  exercises: z.array(adHocExerciseSchema).max(40).optional()
});

const updateEntrySetSchema = z.object({
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(1).max(100),
  weightKg: z.number().min(0).max(700),
  restSeconds: z.number().int().min(0).max(1200).optional(),
  completed: z.boolean().optional()
});

const updateEntrySchema = z
  .object({
    exercise: z.string().min(1),
    order: z.number().int().positive(),
    plannedSets: z.number().int().min(1).max(20),
    plannedRepsMin: z.number().int().min(1).max(50),
    plannedRepsMax: z.number().int().min(1).max(50),
    plannedWeightKg: z.number().min(0).max(700).optional(),
    restSeconds: z.number().int().min(10).max(600).optional(),
    notes: z.string().max(300).optional(),
    performedSets: z.array(updateEntrySetSchema).max(40).optional()
  })
  .refine((data) => data.plannedRepsMin <= data.plannedRepsMax, {
    message: 'plannedRepsMin cannot be greater than plannedRepsMax',
    path: ['plannedRepsMin']
  });

const updateSessionSchema = z.object({
  notes: z.string().max(500).optional(),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
  entries: z.array(updateEntrySchema).max(40).optional()
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
