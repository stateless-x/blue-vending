const vendingMachineController = require("../controllers/vendingMachineController");
const express = require("express");
const router = express.Router();

router.get("/vending-machine/:vendingMachineId", vendingMachineController.getCashReserves)
router.patch("/vending-machine/:vendingMachineId", vendingMachineController.updateCashReserves)

module.exports = router;