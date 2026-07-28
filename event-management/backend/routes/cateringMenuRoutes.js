const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getMenus,
  getMenusByCategory,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/cateringMenuController");


// ================= GET =================

// Get all menus (Admin)
router.get("/", getMenus);

// Get menus by category (User)
router.get("/category/:categoryId", getMenusByCategory);

// Get single menu
router.get("/:id", getMenuById);


// ================= POST =================

router.post("/", upload.single("image"), createMenu);


// ================= PUT =================

router.put("/:id", upload.single("image"), updateMenu);


// ================= DELETE =================

router.delete("/:id", deleteMenu);


module.exports = router;