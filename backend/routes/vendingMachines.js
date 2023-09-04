const vendingMachineController = require("../controllers/vendingMachineController");
const express = require("express");
const router = express.Router();

router.get("/api/vending-machines", vendingMachineController.getAllVendingMachines);
router.get(
  "/api/vending-machine/:vendingMachineId",
  vendingMachineController.getMachineInventory
);
router.get(
  "/api/vending-machine/:vendingMachineId/cash",
  vendingMachineController.getCashReserves
);
router.patch(
  "/api/vending-machine/:vendingMachineId",
  vendingMachineController.updateCashReserves
);
router.patch(
  "/api/vending-machine/:vendingMachineId/transaction",
  vendingMachineController.processTransaction
);

module.exports = router;
