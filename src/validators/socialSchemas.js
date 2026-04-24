const { z } = require('zod');

/**
 * Validador para operaciones con IDs de amigos
 * Se usa en los parámetros de rutas como /friends/:friendId
 */
const friendIdSchema = z.object({
  friendId: z.string().min(1, 'friendId is required')
});

module.exports = {
  friendIdSchema
};
