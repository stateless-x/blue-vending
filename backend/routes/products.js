const productController = require("../controllers/productsController");
const express = require("express");
const router = express.Router();

router.get("/products", productController.getAllProducts);
// router.get("/product/:id", getProductById);
router.post("/product", productController.addProduct);
// router.patch("/product/:id", updateProduct);
// router.delete("/product/:id", deleteProduct);
// router.delete("/products", deleteAllProducts);

module.exports = router;
