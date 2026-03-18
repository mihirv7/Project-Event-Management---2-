const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ FIRST: single product route
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ THEN: category products
router.get("/:categoryId", async (req, res) => {
  const data = await Product.find({
    categoryId: req.params.categoryId
  });

  res.json(data);
});

// add product
router.post("/add", async (req, res) => {
  try {
    const { name, price, image, description, categoryId, customizations  } = req.body;

    const newProduct = new Product({
      name,
      price,
      image,
      description,
      categoryId,
      customizations 
    });

    await newProduct.save();

    res.json({ message: "Product added", data: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;