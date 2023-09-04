const sequelize = require("../database");

//models
const Product = require("./products");
const VendingMachine = require("./vendingMachines");
const VendingProduct = require("./vendingProducts");

//refs
Product.hasMany(VendingProduct, { foreignKey: "productId" });
VendingProduct.belongsTo(Product, { foreignKey: "productId" });
VendingProduct.belongsTo(VendingMachine, { foreignKey: "vendingMachineId" });
VendingMachine.hasMany(VendingProduct, { foreignKey: "vendingMachineId" });

sequelize.sync({ force: false }).then(() => {
  console.log("sequelize sync'd");
});

module.exports = { Product, VendingMachine, VendingProduct };
