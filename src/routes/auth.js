const { Router } = require("express");
const router = Router();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { validate } = require("../middleware/validate");
const { issue } = require("../middleware/auth");

const users = []; // in-memory demo only
let nextUserId = 1;

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

//register and check email exists, then create token.
router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password } = req.validated.body;
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: "Email exists" });
  }
  const passwordHash = await bcrypt.hash(password, 10); //Hash passwords with bcrypt
  const user = { id: nextUserId++, email, passwordHash };
  users.push(user);
  const token = issue({ sub: user.id, email: user.email });
  res.status(201).json({ token });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated.body;
  const user = users.find((u) => u.email === email); //&& u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = issue({ sub: user.id, email: user.email });
  res.json({ token });
});
//bcrypt is a proven algorithm with salt and cost factor; hashing protects users if storage is compromised
module.exports = router;

//---------------------------------------------------------------
//full example showing categories and transactions with both global and route-specific middleware
//-------------------------------
// Middleware in Express is like a checkpoint or filter for your requests.

// It can check something (auth, validation, logging)

// It can modify the request before it reaches the route handler

// It can stop the request if something is wrong
// const express = require('express');
// const app = express();

// app.use(express.json()); // parse JSON bodies

// // ===================
// // 1️⃣ Global Middleware
// // ===================
// app.use((req, res, next) => {
//   console.log(`[GLOBAL] ${req.method} ${req.url}`);
//   next(); // pass to next middleware or route
// });

// // ===================
// // 2️⃣ Route-Specific Middleware
// // ===================

// // Category-specific middleware
// app.use('/categories', (req, res, next) => {
//   console.log(`[CATEGORY] ${req.method} ${req.url}`);
//   next();
// });

// // Transaction-specific middleware
// app.use('/transactions', (req, res, next) => {
//   console.log(`[TRANSACTION] ${req.method} ${req.url}`);
//   next();
// });

// // ===================
// // 3️⃣ Dummy Data
// // ===================
// let categories = [
//   { id: 1, name: 'Salary', type: 'income' },
//   { id: 2, name: 'Groceries', type: 'expense' },
// ];

// let transactions = [
//   { id: 1, amount: 5000, type: 'income', categoryId: 1, date: '2025-10-04T10:00:00Z' },
//   { id: 2, amount: 200, type: 'expense', categoryId: 2, date: '2025-10-04T12:00:00Z' },
// ];

// // ===================
// // 4️⃣ Routes
// // ===================

// // Categories routes
// app.get('/categories', (req, res) => {
//   res.json(categories);
// });

// app.post('/categories', (req, res) => {
//   const { name, type } = req.body;
//   const newCat = { id: categories.length + 1, name, type };
//   categories.push(newCat);
//   res.status(201).json(newCat);
// });

// // Transactions routes
// app.get('/transactions', (req, res) => {
//   res.json(transactions);
// });

// app.post('/transactions', (req, res) => {
//   const { amount, type, categoryId, date } = req.body;
//   const newTx = { id: transactions.length + 1, amount, type, categoryId, date };
//   transactions.push(newTx);
//   res.status(201).json(newTx);
// });

// // ===================
// // 5️⃣ Start Server
// // ===================
// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

// | Request              | Console Logs                                                          |
// | -------------------- | --------------------------------------------------------------------- |
// | `GET /categories`    | `[GLOBAL] GET /categories` <br> `[CATEGORY] GET /categories`          |
// | `POST /categories`   | `[GLOBAL] POST /categories` <br> `[CATEGORY] POST /categories`        |
// | `GET /transactions`  | `[GLOBAL] GET /transactions` <br> `[TRANSACTION] GET /transactions`   |
// | `POST /transactions` | `[GLOBAL] POST /transactions` <br> `[TRANSACTION] POST /transactions` |

// How this maps to real apps

// Global logging → for monitoring everything

// Route-specific middleware → validation or auth for only transactions/categories

// Controllers → handle the actual business logic
