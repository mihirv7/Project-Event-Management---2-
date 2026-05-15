const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");

router.post("/create-order", async (req, res) => {

  try {

    const options = {

      amount: Number(req.body.amount) * 100,

      currency: "INR",

      receipt: "receipt_order"
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);
  }
});

module.exports = router;