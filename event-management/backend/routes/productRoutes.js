const express = require("express");
const router = express.Router();
const Product = require("../models/Product");



// ✅ THEN: category products


// add product
const upload = require("../middleware/upload");

// add product
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;

    // 👇 FIX HERE
    let customizations = [];
    if (req.body.customizations) {
      customizations = JSON.parse(req.body.customizations);
    }

    const newProduct = new Product({
      name,
      price,
      description,
      categoryId,
      image: req.file ? req.file.filename : "",
      customizations
    });

    await newProduct.save();

    res.json({ message: "Product added", data: newProduct });

  } catch (err) {
    console.log(err); // 🔥 IMPORTANT
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;

    const customizations = JSON.parse(req.body.customizations || "[]");

    const updateData = {
      name,
      price,
      description,
      categoryId,
      customizations
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/all", async (req, res) => {
  try {
    const data = await Product.find()
    .populate("categoryId", "name"); // 👈 populate category name
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ FIRST: single product route
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:categoryId", async (req, res) => {
  const data = await Product.find({
    categoryId: req.params.categoryId
  });

  res.json(data);
});
router.get("/", async (req, res) => {

  try {

    const data = await Product.find();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
});
module.exports = router;