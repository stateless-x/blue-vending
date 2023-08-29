const productController = require("../controllers/productsController");
const express = require("express");
const router = express.Router();

router.get("/products", productController.getAllProducts);
router.get("/product/:productId", productController.getProductById);
router.post("/product", productController.addProduct);
router.patch("/product/:productId", productController.updateProduct);
router.delete("/product/:productId", productController.deleteProduct);

module.exports = router;
