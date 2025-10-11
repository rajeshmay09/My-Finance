const { _transactions: transactions } = require("./transactions.controller");
const { _categories: categories } = require("./categories.controller");

function monthWindow(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
}

function inRange(d, start, end) {
  const x = new Date(d);
  return x >= start && x <= end;
}

function summaryMonth(req, res) {
  const { start, end } = monthWindow();
  const inMonth = transactions.filter((t) => inRange(t.date, start, end));
  const totals = inMonth.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      if (t.type === "expense") acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const net = totals.income - totals.expense;
  res.json({
    period: "month",
    start: start.toISOString(),
    end: end.toISOString(),
    ...totals,
    net,
  });
}

function perCategoryMonth(req, res) {
  const { start, end } = monthWindow();
  const inMonth = transactions.filter((t) => inRange(t.date, start, end));

  const map = new Map();
  for (const t of inMonth) {
    const cat = categories.find((c) => c.id === Number(t.categoryId)) || {
      id: t.categoryId,
      name: "Unknown",
      type: t.type,
    };
    const key = String(cat.id);
    if (!map.has(key))
      map.set(key, {
        categoryId: cat.id,
        name: cat.name,
        type: cat.type,
        total: 0,
      });
    const entry = map.get(key);
    entry.total += t.amount * (t.type === "expense" ? -1 : 1);
  }

  const list = Array.from(map.values()).sort(
    (a, b) => Math.abs(b.total) - Math.abs(a.total)
  );
  res.json({ period: "month", items: list });
}

function dailyRange(req, res) {
  const { from, to } = req.query;
  const start = from
    ? new Date(from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = to
    ? new Date(to)
    : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const series = days.map((d) => {
    const ds = d.toISOString().slice(0, 10);
    const dayTx = transactions.filter((t) => t.date.slice(0, 10) === ds);
    const income = dayTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = dayTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { date: ds, income, expense, net: income - expense };
  });
  res.json({ from: start.toISOString(), to: end.toISOString(), items: series });
}

module.exports = { summaryMonth, perCategoryMonth, dailyRange };
