const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/cateringCategoryController");

const uploadFields = upload.fields([
  { name: "cardImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", uploadFields, createCategory);
router.put("/:id", uploadFields, updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;