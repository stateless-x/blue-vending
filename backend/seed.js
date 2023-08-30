const {
  VendingMachine,
  Product,
  VendingProduct,
} = require("./models/modelCollection");
const sequelize = require("./database");
const { resetDatabase } = require("./resetDB");

const seedData = async () => {
  await resetDatabase();
  const transaction = await sequelize.transaction();

  try {
    const vendingMachine1 = await VendingMachine.create(
      {
        coinStock: JSON.stringify({ Coin1THB: 10, Coin5THB: 15, Coin10THB: 5 }),
        noteStock: JSON.stringify({
          Note20THB: 5,
          Note50THB: 7,
          Note100THB: 3,
        }),
        currentCash: 885,
      },
      { transaction }
    );

    const vendingMachine2 = await VendingMachine.create(
      {
        coinStock: JSON.stringify({ Coin1THB: 20, Coin5THB: 25, Coin10THB: 8 }),
        noteStock: JSON.stringify({
          Note20THB: 10,
          Note50THB: 12,
          Note100THB: 6,
        }),
        currentCash: 1625,
      },
      { transaction }
    );

    const vendingMachine3 = await VendingMachine.create(
      {
        coinStock: JSON.stringify({ Coin1THB: 5, Coin5THB: 10, Coin10THB: 4 }),
        noteStock: JSON.stringify({
          Note20THB: 4,
          Note50THB: 6,
          Note100THB: 2,
        }),
        currentCash: 540,
      },
      { transaction }
    );

    const cola = await Product.create(
      { productName: "Cola", price: 20 },
      { transaction }
    );
    const chips = await Product.create(
      { productName: "Chips", price: 15 },
      { transaction }
    );
    const chocolate = await Product.create(
      { productName: "Chocolate", price: 25 },
      { transaction }
    );
    const water = await Product.create(
      { productName: "Water", price: 10 },
      { transaction }
    );
    const juice = await Product.create(
      { productName: "Juice", price: 30 },
      { transaction }
    );

    await VendingProduct.create(
      {
        vendingMachineId: vendingMachine1.vendingMachineId,
        productId: cola.productId,
        stock: 10,
      },
      { transaction }
    );
    await VendingProduct.create(
      {
        vendingMachineId: vendingMachine1.vendingMachineId,
        productId: chips.productId,
        stock: 20,
      },
      { transaction }
    );
    await VendingProduct.create(
      {
        vendingMachineId: vendingMachine2.vendingMachineId,
        productId: chocolate.productId,
        stock: 15,
      },
      { transaction }
    );
    await VendingProduct.create(
      {
        vendingMachineId: vendingMachine3.vendingMachineId,
        productId: water.productId,
        stock: 25,
      },
      { transaction }
    );
    await VendingProduct.create(
      {
        vendingMachineId: vendingMachine3.vendingMachineId,
        productId: juice.productId,
        stock: 20,
      },
      { transaction }
    );

    await transaction.commit();
    console.log("Data successfully added!");
  } catch (error) {
    await transaction.rollback();
    console.error(error);
  }
};

seedData();
