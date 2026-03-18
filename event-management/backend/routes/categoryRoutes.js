const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  const data = await Category.find();
  res.json(data);
});

router.post("/add", async (req, res) => {
  try {
    const { name, image } = req.body;

    const newCategory = new Category({
      name,
      image
    });

    await newCategory.save();

    res.json({ message: "Category added", data: newCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;