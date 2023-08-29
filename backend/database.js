const Sequelize = require("sequelize");

const db_name = "bluepi"
const username = "postgres"
const password = "qwerty123"

const sequelize = new Sequelize(db_name, username, password, {
    host: "localhost",
    dialect: "postgres",
});

module.exports = sequelize;
