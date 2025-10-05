const { z } = require("zod");

const createCategory = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.enum(["income", "expense"]),
  }),
});

const updateCategory = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(["income", "expense"]).optional(),
  }),
});

const idParam = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) }),
});

module.exports = { createCategory, updateCategory, idParam };
