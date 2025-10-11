const { _categories: categories } = require("./categories.controller");

const transactions = [];
let nextTxnId = 1;

function applySort(list, sort) {
  const [field, dir] = sort.split(":");
  const mult = dir === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (field === "date") {
      const ad = new Date(av);
      const bd = new Date(bv);
      if (ad < bd) return -1 * mult;
      if (ad > bd) return 1 * mult;
      return 0;
    }
    if (av < bv) return -1 * mult;
    if (av > bv) return 1 * mult;
    return 0;
  });
}

function list(req, res) {
  const { page, limit, sort, categoryId, from, to } = req.validated.query;
  let list = [...transactions];

  if (categoryId)
    list = list.filter((t) => String(t.categoryId) === String(categoryId));
  if (from) list = list.filter((t) => new Date(t.date) >= new Date(from));
  if (to) list = list.filter((t) => new Date(t.date) <= new Date(to));

  const sorted = applySort(list, sort);
  const p = Number(page) || 1;
  const l = Number(limit) || 10;
  const offset = (p - 1) * l;
  const items = sorted.slice(offset, offset + l);

  res.json({ page: p, limit: l, total: list.length, items });
}

function create(req, res) {
  const { amount, type, categoryId, date, note } = req.validated.body;

  // Cross-check category exists
  const cat = categories.find((c) => c.id === Number(categoryId));
  if (!cat) return res.status(422).json({ error: "categoryId does not exist" });

  const txn = {
    id: nextTxnId++,
    amount,
    type,
    categoryId,
    date,
    note: note || "",
  };
  transactions.push(txn);
  res.status(201).json(txn);
}

module.exports = { list, create, _transactions: transactions };

// function list(req, res) {
//   const { categoryId, from, to } = req.validated.query || {};
//   let list = [...transactions];

//   if (categoryId) {
//     list = list.filter(t => Number(t.categoryId) === Number(categoryId));
//   }

//   if (from) {
//     const fromDate = new Date(from);
//     list = list.filter(t => new Date(t.date) >= fromDate);
//   }

//   if (to) {
//     const toDate = new Date(to);
//     list = list.filter(t => new Date(t.date) <= toDate);
//   }

//   res.json(list);
// }
// function list(req, res) {
//   const { categoryId, from, to } = req.validated.query || {};
//   let list = [...transactions];
//   if (categoryId)
//     list = list.filter((t) => String(t.categoryId) === String(categoryId));
//   if (from) list = list.filter((t) => new Date(t.date) >= new Date(from));
//   if (to) list = list.filter((t) => new Date(t.date) <= new Date(to));
//   res.json(list);
// }
