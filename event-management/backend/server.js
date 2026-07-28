require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

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




const app = express();

// ✅ CONNECT DATABASE
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-bookings", productBookingRoutes);
app.use("/api/users", userRoutes);  
app.use("/uploads", express.static("uploads"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/payment", paymentRoutes);
app.use("/api/catering/categories", cateringCategoryRoutes);
app.use("/api/catering/menu", cateringMenuRoutes);




const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
