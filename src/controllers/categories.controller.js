// src/controllers/categories.controller.js
// In-memory store for learning
const categories = [];
let nextCatId = 1;

function applySort(list, sort) {
  const [field, dir] = sort.split(":");
  const mult = dir === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av < bv) return -1 * mult;
    if (av > bv) return 1 * mult;
    return 0;
  });
}

function list(req, res) {
  const { page, limit, sort } = req.validated.query;
  const sorted = applySort(categories, sort);
  const p = Number(page) || 1;
  const l = Number(limit) || 10;
  const offset = (p - 1) * l;
  const items = sorted.slice(offset, offset + l);
  res.json({ page: p, limit: l, total: categories.length, items });
  //res.json(categories);
}

function create(req, res) {
  const { name, type } = req.validated.body; // from Zod middleware
  const cat = { id: nextCatId++, name, type };
  categories.push(cat);
  res.status(201).json(cat);
}

function update(req, res) {
  const id = Number(req.validated.params.id);
  const { name, type } = req.validated.body;
  const cat = categories.find((c) => c.id === id);
  if (!cat) return res.status(404).json({ error: "not found" });
  if (name) cat.name = name;
  if (type) cat.type = type;
  res.json(cat);
}

function remove(req, res) {
  const id = Number(req.validated.params.id);
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  categories.splice(idx, 1);
  res.status(204).end();
}

module.exports = { list, create, update, remove, _categories: categories };
