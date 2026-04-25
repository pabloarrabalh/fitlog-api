import { z } from 'zod';

/**
 * Exercise Validators - Frontend Zod Schemas
 * These match backend validations in exerciseSchemas.js
 */

// Query validation for listing exercises
export const exerciseQuerySchema = z.object({
  q: z.string().max(100).optional(),
  muscle: z.string().max(60).optional(),
  equipment: z.enum(['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other']).optional(),
  movementPattern: z.enum(['push', 'pull', 'squat', 'hinge', 'carry', 'core', 'other']).optional(),
  difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
  limit: z.number().int().min(1).max(100).optional().default(25),
  page: z.number().int().min(1).optional().default(1),
});

// Body validation for creating/updating exercises
export const exerciseBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Exercise name must be at least 2 characters')
    .max(100, 'Exercise name must be less than 100 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .default(''),
  primaryMuscles: z
    .array(z.string().min(1))
    .min(1, 'At least one primary muscle is required')
    .default([]),
  secondaryMuscles: z.array(z.string().min(1)).optional().default([]),
  equipment: z
    .enum(['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other'], {
      errorMap: () => ({ message: 'Select a valid equipment type' }),
    })
    .optional()
    .default('other'),
  movementPattern: z
    .enum(['push', 'pull', 'squat', 'hinge', 'carry', 'core', 'other'], {
      errorMap: () => ({ message: 'Select a valid movement pattern' }),
    })
    .optional()
    .default('other'),
  difficulty: z
    .enum(['easy', 'moderate', 'hard'], {
      errorMap: () => ({ message: 'Select a valid difficulty level' }),
    })
    .optional()
    .default('moderate'),
  visibility: z
    .enum(['public', 'private'], {
      errorMap: () => ({ message: 'Select a valid visibility' }),
    })
    .optional()
    .default('public'),
  substitutes: z.array(z.string().min(1)).optional().default([]),
});

// Schema for creating exercises
export const createExerciseSchema = exerciseBodySchema;

// Schema for updating exercises (all fields optional)
export const updateExerciseSchema = exerciseBodySchema.partial();

/**
 * Validate exercise data
 * Returns: { valid: boolean, data?: object, error?: string }
 */
export const validateExercise = (data, isUpdate = false) => {
  try {
    const schema = isUpdate ? updateExerciseSchema : createExerciseSchema;
    const validated = schema.parse(data);
    return { valid: true, data: validated };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors = err.errors.reduce((acc, e) => {
        const field = e.path.join('.');
        acc[field] = e.message;
        return acc;
      }, {});
      return { valid: false, fieldErrors };
    }
    return { valid: false, error: 'Validation failed' };
  }
};

// Constants for UI (muscle groups, equipment, etc.)
export const MUSCLE_GROUPS = [
  { label: 'Chest', value: 'chest', emoji: '🫀' },
  { label: 'Back', value: 'back', emoji: '🔙' },
  { label: 'Shoulders', value: 'shoulders', emoji: '💪' },
  { label: 'Biceps', value: 'biceps', emoji: '💪' },
  { label: 'Triceps', value: 'triceps', emoji: '💪' },
  { label: 'Forearms', value: 'forearms', emoji: '✊' },
  { label: 'Quads', value: 'quads', emoji: '🦵' },
  { label: 'Hamstrings', value: 'hamstrings', emoji: '🦵' },
  { label: 'Glutes', value: 'glutes', emoji: '🍑' },
  { label: 'Abs', value: 'abs', emoji: '⬜' },
  { label: 'Calves', value: 'calves', emoji: '🦵' },
];

export const EQUIPMENT_OPTIONS = [
  { label: 'Barbell', value: 'barbell', icon: '🏋️' },
  { label: 'Dumbbell', value: 'dumbbell', icon: '🏋️' },
  { label: 'Machine', value: 'machine', icon: '⚙️' },
  { label: 'Cable', value: 'cable', icon: '🔗' },
  { label: 'Bodyweight', value: 'bodyweight', icon: '🤸' },
  { label: 'Kettlebell', value: 'kettlebell', icon: '🫖' },
  { label: 'Other', value: 'other', icon: '❓' },
];

export const MOVEMENT_PATTERNS = [
  { label: 'Push', value: 'push', emoji: '📤' },
  { label: 'Pull', value: 'pull', emoji: '📥' },
  { label: 'Squat', value: 'squat', emoji: '⬇️' },
  { label: 'Hinge', value: 'hinge', emoji: '🤸' },
  { label: 'Carry', value: 'carry', emoji: '🚶' },
  { label: 'Core', value: 'core', emoji: '⬜' },
  { label: 'Other', value: 'other', emoji: '❓' },
];

export const DIFFICULTY_OPTIONS = [
  { label: 'Easy', value: 'easy', color: 'green' },
  { label: 'Moderate', value: 'moderate', color: 'yellow' },
  { label: 'Hard', value: 'hard', color: 'red' },
];
