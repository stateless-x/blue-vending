const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const VendingMachines = sequelize.define("VendingMachine", {
  vendingMachineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  coinStock: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  noteStock: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  currentCash: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
module.exports = VendingMachines;
