const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const upload = require("../middleware/upload");

// ==========================
// GET ALL CATEGORIES
// ==========================
router.get("/", async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// ADD CATEGORY
// ==========================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = new Category({
      name,
      image: req.file ? req.file.filename : ""
    });

    await newCategory.save();

    res.json({ message: "Category added", data: newCategory });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// DELETE CATEGORY
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// UPDATE CATEGORY
// ==========================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    const updateData = { name };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;