const CateringMenu = require("../models/CateringMenu");


// ================= GET ALL MENUS =================

const getMenus = async (req, res) => {
  try {

    const menus = await CateringMenu
      .find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(menus);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= GET MENU BY CATEGORY =================

const getMenusByCategory = async (req, res) => {
  try {

    const menus = await CateringMenu.find({
      categoryId: req.params.categoryId,
      status: true,
    });

    res.status(200).json(menus);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= GET SINGLE MENU =================

const getMenuById = async (req, res) => {
  try {

    const menu = await CateringMenu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    res.status(200).json(menu);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= CREATE MENU =================

const createMenu = async (req, res) => {
  try {

    const menu = new CateringMenu({

      categoryId: req.body.categoryId,

      foodType: req.body.foodType,

      thaliName: req.body.thaliName,

      description: req.body.description,

      price: req.body.price,

      status: req.body.status,

      image: req.file
        ? req.file.filename
        : "",

    });

    await menu.save();

    res.status(201).json(menu);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= UPDATE MENU =================

const updateMenu = async (req, res) => {
  try {

    const menu = await CateringMenu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    menu.categoryId = req.body.categoryId || menu.categoryId;
    menu.foodType = req.body.foodType || menu.foodType;
    menu.thaliName = req.body.thaliName || menu.thaliName;
    menu.description = req.body.description || menu.description;
    menu.price = req.body.price || menu.price;
    menu.status = req.body.status || menu.status;

    if (req.file) {
      menu.image = req.file.filename;
    }

    await menu.save();

    res.status(200).json(menu);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= DELETE MENU =================

const deleteMenu = async (req, res) => {
  try {

    const menu = await CateringMenu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        message: "Menu not found",
      });
    }

    await menu.deleteOne();

    res.status(200).json({
      message: "Menu deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


module.exports = {

  getMenus,
  getMenusByCategory,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,

};