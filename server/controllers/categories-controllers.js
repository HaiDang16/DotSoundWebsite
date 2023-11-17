const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Category = require("../models/category");

const createCategory = async (req, res) => {
  console.log("\n Start createCategory");
  const catName = req.body.catName;
  console.log("catName: ", catName);
  const createdCategory = new Category({
    catName: catName,
  });

  try {
    await createdCategory.save();
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      message: "Tạo thể loại thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }
  return res.status(201).json({
    message: "Tạo thể loại thành công",
    category: createdCategory,
    success: true,
  });
};

//Lấy toàn bộ Categories
const getAllCategories = async (req, res, next) => {
  let categories;

  try {
    //Lấy ra những sản phẩm với size bán chạy nhất
    categories = await Category.find().sort({ catName: -1 });
  } catch (err) {
    const error = new HttpError(
      "Lấy dữ liệu thể loại thất bại, vui lòng thử lại sau",
      500
    );
    return next(error);
  }
  res.json({
    categories: categories.map((categories) => {
      const obj = categories.toObject({ getters: true });

      return obj;
    }),
  });
};

//Lấy toàn bộ Categories
const getCategoryDetails = async (req, res) => {
  let categories;
  const categoryID = req.params.categoryID;
  try {
    //Lấy ra những sản phẩm với size bán chạy nhất
    categories = await Category.findOne({ _id: categoryID });
  } catch (err) {
    return res.status(500).json({
      message: "Lấy thông tin thể loại thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }
  if (!categories) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy thông tin thể loại", success: false });
  }
  const obj = categories.toObject({ getters: true });
  return res.json({
    category: obj,
    success: true,
    message: "Lấy thông tin thể loại thành công",
  });
};

const updateCategory = async (req, res) => {
  console.log("\nStart updateCategory");
  let { catKey, catName, catGentle, catID } = req.body;

  console.log("catKey: ", catKey);
  let cateData;

  try {
    cateData = await Category.findById(catID);
  } catch (err) {
    return res.status(500).json({
      message: "Cập nhật thông tin thể loại thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }
  if (!cateData) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy thông tin thể loại", success: false });
  }

  try {
    cateData.catKey = catKey;
    cateData.catName = catName;
    cateData.catGentle = catGentle;
    await cateData.save();
  } catch (err) {
    console.error("Error updateCategory:", err);
    return res.status(500).json({
      message: "Cập nhật thông tin thể loại thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }

  return res.status(200).json({
    category: cateData,
    success: true,
    message: "Cập nhật thể loại thành công",
  });
};

const deleteCategory = async (req, res) => {
  console.log("\nStart deleteCategory");
  const categoryID = req.params.categoryID;
  console.log("categoryID: ", categoryID);

  try {
    const deletedCategory = await Category.findByIdAndRemove(categoryID);

    console.log("deletedCategory: ", deletedCategory);

    // Kiểm tra xem có người dùng và đã xóa thành công hay không
    if (!deletedCategory) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin thể loại",
        success: false,
      });
    }

    return res
      .json({ message: "Xóa thể loại thành công.", success: true })
      .status(200);
  } catch (error) {
    console.error("Error deleteCategory: ", error);
    return res
      .status(500)
      .json({ message: "Xoá thể loại thất bại", success: false });
  }
};

exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
exports.getCategoryDetails = getCategoryDetails;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
