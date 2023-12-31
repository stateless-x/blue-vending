const {
  VendingMachine,
  Product,
  VendingProduct,
} = require("../models/modelCollection");
const { VALID_COINS, VALID_NOTES } = require("./constants.js");
// get cash by machine id
exports.getCashReserves = async (req, res) => {
  try {
    const vm = await fetchCashReserves(req.params.vendingMachineId);
    if (!vm) {
      return res.status(404).send("Machine Not found.");
    }
    return res.status(200).json(vm);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

// update or create cash by machine id
exports.updateCashReserves = async (req, res) => {
  try {
    const existing = await fetchCashReserves(req.params.vendingMachineId);
    if (!validateCashInput(req.body, false)) {
      return res.status(400).send("Invalid fields");
    }
    if (!existing) {
      await setInitialCashReserves(req.body);
      return res.status(201).send("Initial cash reserves set");
    } else {
      await updateExistedCashReserve(req.body, req.params);
      return res.status(200).send("Updated Successfully");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.processTransaction = async (req, res) => {
  const { coinsInserted, notesInserted, vendingMachineId, productId } =
    req.body;

  //validate transaction machines and product must exist
  const [vm, product] = await Promise.all([
    VendingMachine.findByPk(vendingMachineId),
    Product.findByPk(productId),
  ]);

  if (!vm || !product) {
    return res.status(400).send("Vending Machine or Product Not Found");
  }
  if (!validateCashInput(req.body, true)) {
    return res.status(400).send("Invalid Cash Input");
  }
  // assign stock of cash inside the machine
  let coinStock = vm.coinStock;
  let noteStock = vm.noteStock;
  const productPrice = product.price;

  let totalCashInserted = calculateTotalCashInserted(
    coinsInserted,
    notesInserted
  );

  // if not enough cash inserted, don't allow them to proceed
  if (totalCashInserted < productPrice) {
    return res
      .status(400)
      .send(`Not Enough funds! Please insert at least ${productPrice} THB`);
  }

  //update newly addded cash by type (coins/notes) to the stock
  coinStock = updateCashStock(coinStock, coinsInserted);
  noteStock = updateCashStock(noteStock, notesInserted);

  let changeToGive = totalCashInserted - productPrice;
  const changeGiven = {};
  // sorted so that higher goes first
  const sortedCoinTypes = parseAndSortCashType(VALID_NOTES, "Coin");
  const sortedNoteTypes = parseAndSortCashType(VALID_COINS, "Note");
  const allCashTypes = parseAndSortCashType(
    [...sortedCoinTypes, ...sortedNoteTypes],
    /(Coin|Note)/
  );

  // calculate change
  for (const cashType of allCashTypes) {
    const cashValue = parseInt(
      cashType.replace(/(Coin|Note)/, "").replace("THB", ""),
      10
    );
    const stock = cashType.includes("Coin") ? coinStock : noteStock;
    changeToGive = calculateOptimalChangeForType(
      changeToGive,
      cashValue,
      stock,
      cashType,
      changeGiven
    );
  }

  if (changeToGive > 0) {
    return res
      .status(400)
      .send("Sorry, not enough change. Please try again later.");
  }
  // total amount to return (by values)
  const totalChangeReturned = Object.entries(changeGiven).reduce(
    (total, [type, count]) => {
      const value = parseInt(
        type.replace(/(Coin|Note)/, "").replace("THB", ""),
        10
      );
      return total + value * count;
    },
    0
  );

  try {
    //update coinstock in the machine
    await VendingMachine.update(
      {
        coinStock,
        noteStock,
        currentCash: calculateTotalCash(coinStock, noteStock),
      },
      { where: { vendingMachineId: vendingMachineId } }
    );

    //update product stock in the machine
    await VendingProduct.decrement("stock", {
      where: { vendingMachineId: vendingMachineId, productId: productId },
    });

    // return data to client
    return res.status(200).json({
      msg: "Thank you for your purchase!",
      changeDetails: changeGiven,
      totalChangeReturned: totalChangeReturned,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

// get inventory of the machine by id
exports.getMachineInventory = async (req, res) => {
  try {
    // put product with lower stock below for better user experience
    const inventory = await VendingProduct.findAll({
      where: { vendingMachineId: req.params.vendingMachineId },
      order: [["stock", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["productId", "productName", "price", "productImage"],
        },
      ],
    });

    const formattedInventory = inventory.map((item) => {
      return {
        productId: item.Product.productId,
        productName: item.Product.productName,
        price: item.Product.price,
        productImage: item.Product.productImage,
        stock: item.stock,
      };
    });

    if (formattedInventory.length === 0) {
      return res.status(400).send("inventory not avaialable");
    }
    return res.status(200).json(formattedInventory);
  } catch (error) {
    console.error(error);
    return res.status(500).send("something went wrong");
  }
};

// get data of all machines (not using this in client yet. just for backend debugging)
exports.getAllVendingMachines = async (req, res) => {
  try {
    const vm = await VendingMachine.findAll();
    return res.status(200).json(vm);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

function validateCashInput(body, isTransaction) {
  let coins, notes;
  if (isTransaction) {
    coins = body.coinsInserted;
    notes = body.notesInserted;
  } else {
    coins = body.coinStock;
    notes = body.noteStock;
  }

  for (const coinType in body.coinStock) {
    if (!VALID_NOTES.includes(coinType)) {
      return false;
    }
  }

  for (const noteType in body.noteStock) {
    if (!VALID_COINS.includes(noteType)) {
      return false;
    }
  }

  return true;
}

async function setInitialCashReserves(body) {
  try {
    await VendingMachine.create({
      coinStock: body.coinStock,
      noteStock: body.noteStock,
      currentCash: calculateTotalCash(body.coinStock, body.noteStock),
    });
  } catch (error) {
    console.error("something went wrong");
    throw error;
  }
}

async function updateExistedCashReserve(body, params) {
  try {
    await VendingMachine.update(
      {
        coinStock: body.coinStock,
        noteStock: body.noteStock,
        currentCash: calculateTotalCash(body.coinStock, body.noteStock),
      },
      {
        where: {
          vendingMachineId: params.vendingMachineId,
        },
      }
    );
  } catch (error) {
    console.error("something went wrong");
    throw error;
  }
}

function calculateTotalCash(coinStock, noteStock) {
  let totalCash = 0;
  for (const [coinType, coinCount] of Object.entries(coinStock)) {
    const coinValue = parseInt(
      coinType.replace("Coin", "").replace("THB", ""),
      10
    );
    totalCash += coinValue * coinCount;
  }

  for (const [noteType, noteCount] of Object.entries(noteStock)) {
    const noteValue = parseInt(
      noteType.replace("Note", "").replace("THB", ""),
      10
    );
    totalCash += noteValue * noteCount;
  }

  return totalCash;
}
// utility to remove string from key and parse to int (eg. Coin10THB => 10)
function parseAndSortCashType(validTypes, keyword) {
  return validTypes.sort(
    (a, b) =>
      parseInt(b.replace(keyword, "").replace("THB", ""), 10) -
      parseInt(a.replace(keyword, "").replace("THB", ""), 10)
  );
}

function calculateTotalCashInserted(coinsInserted, notesInserted) {
  let total = 0;
  for (const [type, amount] of Object.entries(coinsInserted)) {
    total += parseInt(type.replace("Coin", "").replace("THB", ""), 10) * amount;
  }
  for (const [type, amount] of Object.entries(notesInserted)) {
    total += parseInt(type.replace("Note", "").replace("THB", ""), 10) * amount;
  }
  return total;
}

function updateCashStock(cashStock, amountInserted) {
  const updatedCashStock = { ...cashStock };
  for (const [type, amount] of Object.entries(amountInserted)) {
    if (updatedCashStock.hasOwnProperty(type)) {
      updatedCashStock[type] += amount;
    } else {
      updatedCashStock[type] = amount;
    }
  }
  return updatedCashStock;
}

function calculateOptimalChangeForType(
  changeToGive,
  cashValue,
  stock,
  cashType,
  changeGiven
) {
  //make sure the system has enough change to give out and give out more than it suppose to
  if (changeToGive >= cashValue && stock[cashType] > 0) {
    //max possible units of this cash type.
    const maxCashToDispense = Math.min(
      Math.floor(changeToGive / cashValue),
      stock[cashType]
    );
    changeToGive -= maxCashToDispense * cashValue;
    stock[cashType] -= maxCashToDispense;
    changeGiven[cashType] = maxCashToDispense;
  }
  return changeToGive;
}

async function fetchCashReserves(vendingMachineId) {
  const vm = await VendingMachine.findByPk(vendingMachineId);
  return vm ? vm : null;
}
