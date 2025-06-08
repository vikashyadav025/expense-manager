const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryWithItems,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getCategories).post(protect, createCategory);
router
  .route("/:id")
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);
router.route("/:id/items").get(protect, getCategoryWithItems);

module.exports = router;
