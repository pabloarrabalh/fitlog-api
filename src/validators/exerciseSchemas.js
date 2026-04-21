const { z } = require('zod');

const exerciseQuerySchema = z.object({
  q: z.string().max(100).optional(),
  muscle: z.string().max(60).optional(),
  equipment: z.enum(['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'other']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  page: z.coerce.number().int().min(1).optional().default(1)
});

module.exports = {
  exerciseQuerySchema
};
