const { z } = require("zod");
const { paginationQuery } = require("./common");

// ISO date string or YYYY-MM-DD; controller will parse Date
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .or(
    z
      .string()
      .datetime({ offset: true })
      .or(z.string().datetime({ offset: false }))
  );

const createTransaction = z.object({
  body: z.object({
    amount: z.number(),
    type: z.enum(["income", "expense"]),
    categoryId: z.number(),
    date: z.string().datetime().or(z.string().min(1)), // keep simple for now
    note: z.string().optional(),
  }),
});

const listTransactions = z.object({
  query: paginationQuery.extend({
    categoryId: z.string().optional(),
    from: dateString.optional(),
    to: dateString.optional(),
  }),
});

module.exports = { createTransaction, listTransactions };

//Zod schemas validate and normalize query/body/params so controllers can trust inputs and
// use req.validated consistently for pagination, sorting, and date/amount checks
