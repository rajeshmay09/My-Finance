// src/controllers/categories.controller.js
// In-memory store for learning
const categories = [];
let nextCatId = 1;

function list(req, res) {
  res.json(categories);
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

module.exports = { list, create, update, remove };
