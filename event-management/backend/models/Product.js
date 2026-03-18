const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  categoryId: String,
  customizations: [
    {
      name: String,
      options: [String]
    }
  ],
  default:[]
});

module.exports = mongoose.model("Product", productSchema);