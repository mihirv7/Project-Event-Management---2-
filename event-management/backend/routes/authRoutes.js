const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
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

    // Create token with user ID and role
const token = jwt.sign(
  {
    id: user._id,
    role: user.role || "user"
  },
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
// =========================
// FORGOT PASSWORD
// =========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    // Don't reveal whether the email exists
    if (!user) {
      return res.json({
        message: "If an account exists with this email, a reset link has been sent."
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiry (15 minutes)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    // Reset password link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Momento Password",
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
              🔐 Reset Your Password
            </h2>

            <p>
              Hello <strong>${user.fullName}</strong>,
            </p>

            <p>
              We received a request to reset your password for
              <strong>Momento Event Management</strong>.
            </p>

            <p>
              Click the button below to create a new password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a
                href="${resetLink}"
                style="
                  background-color: #ff7a00;
                  color: white;
                  padding: 12px 25px;
                  text-decoration: none;
                  border-radius: 6px;
                  display: inline-block;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>
            </div>

            <p>
              This link will expire in <strong>15 minutes</strong>.
            </p>

            <p>
              If you did not request a password reset, you can safely ignore
              this email.
            </p>

            <hr>

            <p style="text-align: center; color: #777;">
              Momento Event Management
            </p>

          </div>
        `
      });

      console.log(`Password reset email sent to ${user.email}`);

    } catch (emailError) {
      console.log("Password reset email could not be sent:", emailError);
    }

    res.json({
      message: "If an account exists with this email, a reset link has been sent."
    });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
});
// =========================
// RESET PASSWORD
// =========================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or expired"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;

    // Invalidate reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Something went wrong"
    });
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
