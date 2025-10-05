const { z } = require("zod");

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
  query: z.object({
    categoryId: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }),
});

module.exports = { createTransaction, listTransactions };
