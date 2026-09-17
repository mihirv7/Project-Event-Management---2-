const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// =========================
// REGISTER USER
// =========================
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone } = req.body;

    // Check fields
    if (!fullName || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone
    });

    // Save user
    await newUser.save();

    // =========================
    // SEND WELCOME EMAIL
    // =========================
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Momento Event Management 🎉",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 30px;
            border-radius: 12px;
          ">

            <h2 style="text-align: center;">
              🎉 Welcome to Momento!
            </h2>

            <p>
              Hello <strong>${fullName}</strong>,
            </p>

            <p>
              Your account has been successfully created on
              <strong>Momento Event Management</strong>.
            </p>

            <hr>

            <h3>Registration Details</h3>

            <p>
              <strong>Name:</strong> ${fullName}
            </p>

            <p>
              <strong>Email:</strong> ${email}
            </p>

            <p>
              <strong>Phone:</strong> ${phone}
            </p>

            <hr>

            <p>
              You can now explore our event packages, customize your event,
              book products and services, and choose catering options.
            </p>

            <p>
              Thank you for joining <strong>Momento Event Management</strong> ❤️
            </p>

            <p style="text-align: center; color: #777;">
              Momento Event Management
            </p>

          </div>
        `
      });

    } catch (emailError) {
      console.log(
        "User registered, but welcome email could not be sent:",
        emailError
      );
    }

    // Registration response
    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// =========================
// LOGIN USER
// =========================
// =========================
// LOGIN USER (FIXED)
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.fullName,   // ✅ FIXED
        email: user.email,
        role: user.role || "user"   // ✅ IMPORTANT
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error); // 👈 debug
    res.status(500).json({ message: error.message });
  }
});
const authMiddleware = require("../middleware/authMiddleware");

// GET logged in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
