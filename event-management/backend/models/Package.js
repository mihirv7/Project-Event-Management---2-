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
  venue: String,
  coordinatorName: String,
  coordinatorNumber: String,
  startDate: Date,
  endDate: Date,
  images: [String],

  // ✅ FIXED
  catering: [cateringSchema]
},
{ timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
