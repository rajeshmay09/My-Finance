const { Router } = require("express");
const router = Router();

const { validate } = require("../middleware/validate");
const {
  createCategory,
  updateCategory,
  idParam,
} = require("../schemas/category");
const ctrl = require("../controllers/categories.controller");

router.get("/", ctrl.list);
router.post("/", validate(createCategory), ctrl.create);
router.put("/:id", validate(updateCategory), ctrl.update);
router.delete("/:id", validate(idParam), ctrl.remove);

// const categories = [];
// let nextCatId = 1;

// router.get("/", (req, res) => res.json(categories));

// router.post("/", validate(createCategory), (req, res) => {
//   const { name, type } = req.body;
//   if (!name || !type) {
//     return res.status(400).json({ error: "name and type required" });
//   }
//   const cat = { id: nextCatId++, name, type };
//   categories.push(cat);
//   res.status(201).json(cat);
//   console.log(cat);
// });

// router.put("/:id", validate(updateCategory), (req, res) => {
//   const id = Number(req.params.id);
//   const cat = categories.find((c) => c.id === id);
//   if (!cat) return res.status(404).json({ error: "not found" });
//   const { name, type } = req.body;
//   if (name) cat.name = name;
//   if (type) cat.type = type;
//   res.json(cat);
//   console.log(cat);
// });

// app.delete("/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const idx = categories.findIndex((c) => c.id === id);
//   if (idx === -1) return res.status(404).json({ error: "not found" });
//   categories.splice(idx, 1);
//   res.status(204).end();
// });

module.exports = router;
