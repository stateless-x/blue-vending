const sequelize = require("./database");
const {
  VendingMachine,
  Product,
  VendingProduct,
} = require("./models/modelCollection");

async function resetPrimaryKeySequence(sequenceName) {
  try {
    await sequelize.query(`ALTER SEQUENCE "${sequenceName}" RESTART WITH 1`);
  } catch (error) {
    console.error(error);
  }
}

exports.resetDatabase = async () => {
  const transaction = await sequelize.transaction();
  try {
    await VendingProduct.destroy({
      where: {},
      restartIdentity: true,
      transaction,
    });
    await Product.destroy({ where: {}, restartIdentity: true, transaction });
    await VendingMachine.destroy({
      where: {},
      restartIdentity: true,
      transaction,
    });

    await resetPrimaryKeySequence('Products_productId_seq');
    await resetPrimaryKeySequence('VendingMachines_vendingMachineId_seq');

    await transaction.commit();
    console.log("Database has been reset!");
  } catch (error) {
    await transaction.rollback();
    console.error(error);
  }
};
