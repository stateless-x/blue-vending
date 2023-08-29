const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const VendingProduct = sequelize.define("VendingProduct", {
  vendingMachineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "VendingMachines",
      key: "vendingMachineId",
    },
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Products",
      key: "productId",
    },
    primaryKey: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = VendingProduct;
