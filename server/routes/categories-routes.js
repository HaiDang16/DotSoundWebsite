const express = require("express");
const categoriesController = require("../controllers/categories-controllers");

const router = express.Router();

router.get("/GetAllCategories", categoriesController.getAllCategories);
router.get(
  "/GetCategoryDetails/:categoryID",
  categoriesController.getCategoryDetails
);

router.post("/AddCategory", categoriesController.createCategory);

router.put("/UpdateCategory", categoriesController.updateCategory);

router.delete(
  "/DeleteCategory/:categoryID",
  categoriesController.deleteCategory
);

module.exports = router;
