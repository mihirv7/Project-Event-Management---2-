const CateringCategory = require("../models/CateringCategory");

// ================= GET ALL CATEGORIES =================
const getCategories = async (req, res) => {
  try {
    const categories = await CateringCategory.find().sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SINGLE CATEGORY =================
const getCategoryById = async (req, res) => {
  try {
    const category = await CateringCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// 

// ================= CREATE CATEGORY =================
const createCategory = async (req, res) => {

  try {

    // Check duplicate name or slug
    const existingCategory = await CateringCategory.findOne({
      $or: [
        { name: req.body.name },
        { slug: req.body.slug }
      ]
    });

    if (existingCategory) {

      if (existingCategory.name === req.body.name) {
        return res.status(400).json({
          success: false,
          message: "Category name already exists."
        });
      }

      if (existingCategory.slug === req.body.slug) {
        return res.status(400).json({
          success: false,
          message: "Category slug already exists."
        });
      }

    }

    // Create category
    const category = new CateringCategory({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      status: req.body.status,

      cardImage: req.files?.cardImage
        ? req.files.cardImage[0].filename
        : "",

      bannerImage: req.files?.bannerImage
        ? req.files.bannerImage[0].filename
        : "",
    });

    await category.save();

    res.status(201).json(category);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }

};

// ================= UPDATE CATEGORY =================
const updateCategory = async (req, res) => {
  try {
    const category = await CateringCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    category.name = req.body.name || category.name;
    category.slug = req.body.slug || category.slug;
    category.description = req.body.description || category.description;

    if (req.files?.cardImage) {
      category.cardImage = req.files.cardImage[0].filename;
    }

    if (req.files?.bannerImage) {
      category.bannerImage = req.files.bannerImage[0].filename;
    }

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE CATEGORY =================
const deleteCategory = async (req, res) => {
  try {
    const category = await CateringCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= EXPORT =================
module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};