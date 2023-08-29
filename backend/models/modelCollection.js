const sequelize = require("../database");

//models
const Product = require("./products");
const VendingMachine = require("./vendingMachines");
const VendingProduct = require("./vendingProducts");

//refs
VendingMachine.hasMany(VendingProduct, { foreignKey: "vendingMachineId" });
VendingProduct.belongsTo(VendingMachine, { foreignKey: "vendingMachineId" });
Product.hasMany(VendingProduct, { foreignKey: "productId" });
VendingProduct.belongsTo(Product, { foreignKey: "productId" });

sequelize.sync({ force: false }).then(() => {
  console.log("Database & Table Created");
});

module.exports = { Product, VendingMachine, VendingProduct };
