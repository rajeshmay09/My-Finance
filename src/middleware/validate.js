const { ZodError } = require("zod");

const validate = (schema) => async (req, res, next) => {
  try {
    // parseAsync recommended for async refinements
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.validated = parsed;
    next();
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
};

module.exports = { validate };
// const validate = (schema) => (req, res, next) => {
//   try {
//     req.validated = schema.parse({
//       body: req.body,
//       query: req.query,
//       params: req.params,
//     });
//     next();
//   } catch (err) {
//     if (err instanceof ZodError) {
//       return res
//         .status(400)
//         .json({ error: "Validation failed", details: err.errors });
//     }
//     next(err);
//   }
// };
