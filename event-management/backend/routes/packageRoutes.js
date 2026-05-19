const express = require("express");
const router = express.Router();
const Package = require("../models/Package");
const multer = require("multer");
const path = require("path");

// ================= MULTER SETUP =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ================= ADD PACKAGE =================
router.post("/", upload.array("images", 2), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      startDate,
      endDate,
      venue,
      guestCount,
      coordinatorName,
      coordinatorNumber,

    } = req.body;

    let catering = [];

if (req.body.catering) {
  try {
    catering = JSON.parse(req.body.catering);
  } catch (err) {
    catering = [];
  }
}

    // ✅ IMAGES
    const images = req.files ? req.files.map(file => file.filename) : [];

    const newPackage = new Package({
      name,
      description,
      price,
      startDate,
      endDate,
      venue,
      guestCount,
      coordinatorName,
      coordinatorNumber,
      catering,
      images
    });

    await newPackage.save();
    res.json(newPackage);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= GET ALL PACKAGES =================
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= GET SINGLE PACKAGE =================
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

// UPDATE PACKAGE
router.put("/:id", upload.array("images", 2), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      startDate,
      endDate,
      venue,
      guestCount,
      coordinatorName,
      coordinatorNumber
    } = req.body;

    let catering = [];

if (req.body.catering) {
  try {
    catering = JSON.parse(req.body.catering);
  } catch (err) {
    catering = [];
  }
}

let updateData = {
  name,
  description,
  price,
  startDate,
  endDate,
  venue,
  guestCount,
  coordinatorName,
  coordinatorNumber,
  catering
};

    // ✅ handle images
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => f.filename);
    }

    const updated = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= DELETE PACKAGE =================
// DELETE PACKAGE
router.delete("/:id", async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ message: "Package deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;