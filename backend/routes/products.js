const productController = require("../controllers/productsController");
const express = require("express");
const router = express.Router();

router.get("/api/products", productController.getAllProducts);
router.get("/api/product/:productId", productController.getProductById);
router.post("/api/product", productController.addProduct);
router.patch("/api/product/:productId", productController.updateProduct);
router.delete("/api/product/:productId", productController.deleteProduct);

module.exports = router;
