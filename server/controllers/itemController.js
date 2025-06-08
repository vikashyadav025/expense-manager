const asyncHandler = require("express-async-handler");
const Item = require("../models/itemModel");
const Category = require("../models/categoryModel");

// @desc    Get all items for a user
// @route   GET /api/items
// @access  Private
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user._id }).populate(
    "category",
    "name"
  );
  res.json(items);
});

// @desc    Get items by category
// @route   GET /api/items/category/:categoryId
// @access  Private
const getItemsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Check if category exists and belongs to user
  const category = await Category.findOne({
    _id: categoryId,
    user: req.user._id,
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const items = await Item.find({
    category: categoryId,
    user: req.user._id,
  }).populate("category", "name");

  res.json(items);
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    res.status(400);
    throw new Error("Please add item name and category");
  }

  // Check if category exists and belongs to user
  const categoryExists = await Category.findOne({
    _id: category,
    user: req.user._id,
  });

  if (!categoryExists) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const item = await Item.create({
    name,
    category,
    user: req.user._id,
  });

  // Populate category name in response
  await item.populate("category", "name");

  res.status(201).json(item);
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // If category is being updated, check if it exists and belongs to user
  if (category) {
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user._id,
    });

    if (!categoryExists) {
      res.status(400);
      throw new Error("Invalid category");
    }
  }

  item.name = name || item.name;
  item.category = category || item.category;

  const updatedItem = await item.save();
  await updatedItem.populate("category", "name");

  res.json(updatedItem);
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // FIXED: Use deleteOne() instead of remove()
  await Item.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

module.exports = {
  getItems,
  getItemsByCategory,
  createItem,
  updateItem,
  deleteItem,
};
