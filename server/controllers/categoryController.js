const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const Item = require("../models/itemModel");
const Expense = require("../models/expenseModel");

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.json(categories);
});

// @desc    Get category with its items
// @route   GET /api/categories/:id/items
// @access  Private
const getCategoryWithItems = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const items = await Item.find({
    category: req.params.id,
    user: req.user._id,
  });

  res.json({
    category,
    items,
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please add a category name");
  }

  const category = await Category.create({
    name,
    user: req.user._id,
  });

  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (category.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  category.name = name || category.name;
  const updatedCategory = await category.save();

  res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (category.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Check if category has associated expenses
  const expensesCount = await Expense.countDocuments({
    category: req.params.id,
    user: req.user._id,
  });

  if (expensesCount > 0) {
    res.status(400);
    throw new Error(
      "Cannot delete category with associated expenses. Please delete expenses first."
    );
  }

  // Delete all items associated with this category
  await Item.deleteMany({
    category: req.params.id,
    user: req.user._id,
  });

  // Delete the category - FIXED: Use deleteOne() instead of remove()
  await Category.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Category and associated items deleted successfully",
  });
});

module.exports = {
  getCategories,
  getCategoryWithItems,
  createCategory,
  updateCategory,
  deleteCategory,
};
