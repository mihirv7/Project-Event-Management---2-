require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const productBookingRoutes = require("./routes/productBookingRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cateringCategoryRoutes = require("./routes/cateringCategoryRoutes");
const cateringMenuRoutes = require("./routes/cateringMenuRoutes");
const cateringBookingRoutes = require("./routes/cateringBookingRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();

// ============================
// CONNECT DATABASE
// ============================
connectDB();

// ============================
// MIDDLEWARE
// ============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// API ROUTES
// ============================
app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/packages", packageRoutes);

// Booking routes — register only once
app.use("/api/booking", bookingRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-bookings", productBookingRoutes);
app.use("/api/users", userRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/catering/categories", cateringCategoryRoutes);
app.use("/api/catering/menu", cateringMenuRoutes);
app.use("/api/catering-booking", cateringBookingRoutes);

app.use("/api/email", emailRoutes);

// Uploaded files
app.use("/uploads", express.static("uploads"));

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});