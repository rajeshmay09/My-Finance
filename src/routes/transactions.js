const { Router } = require("express");
const router = Router();

const { validate } = require("../middleware/validate");
const {
  createTransaction,
  listTransactions,
} = require("../schemas/transactions");
const ctrl = require("../controllers/transactions.controller");
const { requireDemoAuth } = require("../middleware/require-demo-auth");
const { auth } = require("../middleware/auth");

router.get("/", validate(listTransactions), ctrl.list);
router.post("/", auth, validate(createTransaction), ctrl.create);
//--------------------------
//Route /transactions → requireDemoAuth checks token
// POST /transactions → validate middleware parses & checks body
// Controller (ctrl.create) runs → creates transaction & sends response
//Middleware runs in order: global → router → route-specific
// Controllers are clean, no validation or auth logic inside
// Using routers keeps the app modular
// Zod makes input validation easy and structured
//--------------------------
module.exports = router;
// const transactions = [];
// let nextTxnId = 1;

// router.get("/", (req, res) => {
//   const { categoryId, from, to } = req.query;
//   let list = [...transactions];
//   if (categoryId)
//     list = list.filter((t) => String(t.categoryId) === String(categoryId));
//   if (from) list = list.filter((t) => new Date(t.date) >= new Date(from));
//   if (to) list = list.filter((t) => new Date(t.date) <= new Date(to));
//   res.json(list);
// });

// router.post("/", (req, res) => {
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

module.exports = router;
