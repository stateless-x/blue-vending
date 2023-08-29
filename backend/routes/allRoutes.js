const express = require("express");
const router = express.Router();

const cashRoute = require("./vendingMachines");
const productsRoute = require("./products");

router.use(cashRoute);
router.use(productsRoute);

module.exports = router;
