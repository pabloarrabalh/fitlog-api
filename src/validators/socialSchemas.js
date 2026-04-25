const { z } = require('zod');

/**
 * Validador para operaciones con IDs de amigos
 * Se usa en los parámetros de rutas como /friends/:friendId
 */
const friendIdSchema = z.object({
  friendId: z.string().min(1, 'friendId is required')
});

/**
 * Validador para operaciones con usernames de amigos
 * Se usa en los parámetros de rutas como /friends/:friendUsername
 */
const friendUsernameSchema = z.object({
  friendUsername: z.string().min(1, 'friendUsername is required')
});

module.exports = {
  friendIdSchema,
  friendUsernameSchema
};
