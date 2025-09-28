const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
};

module.exports = { validate };
