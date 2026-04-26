const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  categoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category"
},

  customizations: [
    {
      name: String,
      options: [String]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);