const { z } = require('zod');

/**
 * Validador para actualizar el perfil del usuario actual
 * No permite cambiar: email, username, role, friends
 */
const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2).max(60).optional(),
  lastName: z.string().trim().min(2).max(60).optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  objective: z.enum(['strength', 'hypertrophy', 'endurance', 'recomposition']).optional(),
  bodyWeightKg: z.number().min(30).max(250).nullable().optional(),
  password: z.string().min(5).max(100).optional()
});

/**
 * Validador para obtener usuario por ID (query params)
 */
const userIdSchema = z.object({
  userId: z.string().min(1, 'userId is required')
});

module.exports = {
  updateProfileSchema,
  userIdSchema
};
