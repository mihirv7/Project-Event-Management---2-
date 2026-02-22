const mongoose = require("mongoose");

const cateringSchema = new mongoose.Schema({
  thaliName: String,
  description: String,
  price: Number
});

const packageSchema = new mongoose.Schema(
{
  name: String,
  description: String,
  price: Number,
  startDate: Date,
  endDate: Date,
  images: [String],

  // ✅ FIXED
  catering: [cateringSchema]
},
{ timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
