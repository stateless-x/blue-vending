const vendingMachineController = require("../controllers/vendingMachineController");
const express = require("express");
const router = express.Router();

router.get("/vending-machines", vendingMachineController.getAllVendingMachines)
router.get("/vending-machine/:vendingMachineId", vendingMachineController.getMachineInventory)
router.get("/vending-machine/:vendingMachineId/cash", vendingMachineController.getCashReserves)
router.patch("/vending-machine/:vendingMachineId", vendingMachineController.updateCashReserves)
router.patch("/vending-machine/:vendingMachineId/transaction", vendingMachineController.processTransaction);

module.exports = router;