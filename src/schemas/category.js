const { z } = require("zod");
const { paginationQuery } = require("./common");

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

const listCategories = z.object({
  query: paginationQuery,
});

const idParam = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) }),
});

module.exports = { createCategory, updateCategory, listCategories, idParam };
