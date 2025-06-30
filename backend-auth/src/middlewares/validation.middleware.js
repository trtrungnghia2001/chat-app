import createHttpError from "http-errors";

export function validateAuth(schema) {
  return function (req, res, next) {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw createHttpError.BadRequest(error.message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
