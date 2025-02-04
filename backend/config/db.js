const { Sequelize } = require('sequelize');

// Create a Sequelize instance to connect to the MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Disable SQL logging
});

module.exports = sequelize;
