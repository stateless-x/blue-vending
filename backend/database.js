require("dotenv").config();

const Sequelize = require("sequelize");

const dbName = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbName, username, password, {
    host: host,
    dialect: dialect,
});

module.exports = sequelize;
