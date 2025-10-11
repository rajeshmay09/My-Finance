const { Router } = require("express");
const router = Router();
const ctrl = require("../controllers/reports.controller");

router.get("/summary", ctrl.summaryMonth);
router.get("/categories", ctrl.perCategoryMonth);
router.get("/daily", ctrl.dailyRange);
module.exports = router;
