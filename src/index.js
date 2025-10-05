const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const categoriesRouter = require("./routes/categories");
const transactionsRouter = require("./routes/transactions");
const authRouter = require("./routes/auth");
const { auth } = require("../src/middleware/auth");

app.use("/auth", authRouter);
app.use("/categories", categoriesRouter);
app.use("/transactions", transactionsRouter);

app.get("/", (req, res) => {
  res.send("hello finance");
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const categories = [];
// let nextCatId = 1;

// const transactions = [];
// let nextTxnId = 1;

// // request logger
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// app.get("/categories", (req, res) => {
//   res.json(categories);
// });

// app.post("/categories", (req, res) => {
//   const { name, type } = req.body;
//   if (!name || !type) {
//     return res.status(400).json({ error: "name and type required" });
//   }
//   const cat = { id: nextCatId++, name, type };
//   categories.push(cat);
//   res.status(201).json(cat);
//   console.log(cat);
// });

// app.put("/categories/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const cat = categories.find((c) => c.id === id);
//   if (!cat) return res.status(404).json({ error: "not found" });
//   const { name, type } = req.body;
//   if (name) cat.name = name;
//   if (type) cat.type = type;
//   res.json(cat);
//   console.log(cat);
// });

// app.delete("/categories/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const idx = categories.findIndex((c) => c.id === id);
//   if (idx === -1) return res.status(404).json({ error: "not found" });
//   categories.splice(idx, 1);
//   res.status(204).end();
// });

// app.get("/transactions", (req, res) => {
//   const { categoryId, from, to } = req.query;
//   let list = [...transactions];
//   if (categoryId)
//     list = list.filter((t) => String(t.categoryId) === String(categoryId));
//   if (from) list = list.filter((t) => new Date(t.date) >= new Date(from));
//   if (to) list = list.filter((t) => new Date(t.date) <= new Date(to));
//   res.json(list);
// });

// app.post("/transactions", (req, res) => {
//   const { amount, type, categoryId, date, note } = req.body;
//   if (typeof amount != "number" || !type || !categoryId || !date) {
//     return res
//       .status(400)
//       .json({ error: "amount(number), type, categoryId, date required" });
//   }
//   const txn = {
//     id: nextTxnId++,
//     amount,
//     type,
//     categoryId,
//     date,
//     note: note || "",
//   };
//   transactions.push(txn);
//   res.status(201).json(txn);
// });

// app.get("/reports/summary", (req, res) => {
//   const { period = "month" } = req.query;
//   const now = new Date();
//   const start = new Date(now.getFullYear(), now.getMonth(), 1);
//   const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//   const inRange = transactions.filter((t) => {
//     const d = new Date(t.date);
//     return d >= start && d <= end;
//   });
//   const totals = inRange.reduce(
//     (acc, t) => {
//       if (t.type === "income") acc.income += t.amount;
//       if (t.type === "expense") acc.expense += t.amount;
//       return acc;
//     },
//     { income: 0, expense: 0 }
//   );
//   const net = totals.income - totals.expense;
//   res.json({
//     period,
//     start: start.toISOString(),
//     end: end.toISOString(),
//     ...totals,
//     net,
//   });
// });
// //The ...totals spreads the keys (income and expense) into the new object.

// // 404
// app.use((req, res, next) => {
//   res.status(404).json({ error: "Not found" });
// });

// // error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: "Server error" });
// });
