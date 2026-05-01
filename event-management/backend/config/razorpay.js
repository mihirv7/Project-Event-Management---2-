const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,   // 👈 YOUR KEY ID
  key_secret: process.env.RAZORPAY_SECRET        // 👈 paste secret key here
});

module.exports = razorpay;