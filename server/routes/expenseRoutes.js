const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  deleteExpense,
  getExpenseSummary,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getExpenses).post(protect, createExpense);
router.route("/:id").delete(protect, deleteExpense);
router.route("/summary").get(protect, getExpenseSummary);

module.exports = router;
