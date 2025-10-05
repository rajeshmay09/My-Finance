const transactions = [];
let nextTxnId = 1;

function list(req, res) {
  const { categoryId, from, to } = req.validated.query || {};
  let list = [...transactions];
  if (categoryId)
    list = list.filter((t) => String(t.categoryId) === String(categoryId));
  if (from) list = list.filter((t) => new Date(t.date) >= new Date(from));
  if (to) list = list.filter((t) => new Date(t.date) <= new Date(to));
  res.json(list);
}

function create(req, res) {
  const { amount, type, categoryId, date, note } = req.validated.body;
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

module.exports = { list, create };

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
