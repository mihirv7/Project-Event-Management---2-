const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// ➕ ADD PACKAGE
router.post("/add", async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);

    const {
  name,
  price,
  guestCount,
  description,
  venue,
  coordinatorName,
  coordinatorNumber,
  startDate,
  endDate,
  images,
  catering
} = req.body;


    // validation
    if (
  !name ||
  !description ||
  !venue ||
  !coordinatorName ||
  !coordinatorNumber ||
  !price ||
  !startDate ||
  !endDate ||
  !Array.isArray(images) ||
  images.length < 1
) {
  return res.status(400).json({
    message: "All fields are required"
  });
}


    const newPackage = new Package({
      name,
      price,
      guestCount,
      description,
      venue,
      coordinatorName,
      coordinatorNumber,
      startDate,
      endDate,
      images,
      catering
    });

    await newPackage.save();

    res.status(201).json({
      message: "Package added successfully",
      package: newPackage
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📄 GET ALL PACKAGES
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📄 GET SINGLE PACKAGE BY ID
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
