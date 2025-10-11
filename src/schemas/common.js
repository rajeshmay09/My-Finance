const { z } = require("zod");


const paginationQuery = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
  sort: z
    .string()
    .regex(/^[a-zA-Z_]+:(asc|desc)$/)
    .optional()
    .default("date:desc"),
});

module.exports = { paginationQuery };

//Update Zod schemas (pagination, sorting, stricter fields)