const asyncHandler = require("express-async-handler");
const Expense = require("../models/expenseModel");
const Category = require("../models/categoryModel");
const Item = require("../models/itemModel");

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id })
    .populate("category", "name")
    .populate("item", "name")
    .sort("-date");
  res.json(expenses);
});

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const { category, item, amount, description, date } = req.body;

  if (!category || !item || !amount) {
    res.status(400);
    throw new Error("Please provide category, item and amount");
  }

  // Check if category and item belong to the user
  const categoryExists = await Category.findOne({
    _id: category,
    user: req.user._id,
  });
  const itemExists = await Item.findOne({ _id: item, user: req.user._id });

  if (!categoryExists || !itemExists) {
    res.status(400);
    throw new Error("Invalid category or item");
  }

  const expense = await Expense.create({
    user: req.user._id,
    category,
    item,
    amount,
    description,
    date: date || Date.now(),
  });

  res.status(201).json(expense);
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // FIXED: Use deleteOne() instead of remove()
  await Expense.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

// @desc    Get expenses summary
// @route   GET /api/expenses/summary
// @access  Private
const getExpenseSummary = asyncHandler(async (req, res) => {
  const expenses = await Expense.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $project: { category: "$category.name", totalAmount: 1 } },
  ]);

  res.json(expenses);
});

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
  getExpenseSummary,
};
