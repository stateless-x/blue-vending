const { VendingMachine } = require("../models/modelCollection");

const validCoinTypes = ["Coin1THB", "Coin5THB", "Coin10THB"];
const validNoteTypes = [
  "Note20THB",
  "Note50THB",
  "Note100THB",
  "Note500THB",
  "Note1000THB",
];

async function fetchCashReserves(vendingMachineId) {
  const vm = await VendingMachine.findByPk(vendingMachineId);
  return vm ? vm : null;
}

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

exports.updateCashReserves = async (req, res) => {
  try {
    const body = req.body;
    const params = req.params;
    const existing = await fetchCashReserves(params.vendingMachineId);
    if (!validateCashInput(body)) {
      return res.status(400).send("Invalid fields");
    }
    if (!existing) {
      await setInitialCashReserves(body);
      return res.status(201).send("Initial cash reserves set");
    } else {
      await updateExistedCashReserve(body, params);
      return res.status(200).send("Updated Successfully");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.processTransaction = ()=>{}
function validateCashInput(body) {
  for (const coinType in body.coinStock) {
    if (!validCoinTypes.includes(coinType)) {
      return false;
    }
  }
  for (const noteType in body.noteStock) {
    if (!validNoteTypes.includes(noteType)) {
      return false;
    }
  }
  return true;
}

function setInitialCashReserves(body) {
  try {
    VendingMachine.create({
      coinStock: body.coinStock,
      noteStock: body.noteStock,
      currentCash: calculateTotalCash(body.coinStock, body.noteStock),
    });
  } catch (error) {
    console.error("something went wrong");
    throw error;
  }
}

function updateExistedCashReserve(body, params) {
  try {
    VendingMachine.update(
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
