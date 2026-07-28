const mongoose = require("mongoose");

const cateringMenuSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CateringCategory",
      required: true,
    },

    foodType: {
      type: String,
      enum: ["Regular", "Jain"],
      required: true,
    },

    thaliName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CateringMenu",
  cateringMenuSchema
);