const ApiError = require('../utils/ApiError');

function validate(schema, source = 'body') {
  return function schemaValidator(req, res, next) {
    const payload = req[source];
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return next(new ApiError(400, 'Validation error', details));
    }

    req[source] = parsed.data;
    return next();
  };
}

module.exports = validate;
