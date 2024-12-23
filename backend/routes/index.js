const sequelize = require('../config/db');
const Event = require('./event');

const syncDb = async () => {
  try {
    await sequelize.sync({ force: true }); // Creates tables if they don't exist
    console.log('Database synced');
  } catch (error) {
    console.log('Error syncing database:', error);
  }
};

syncDb();

module.exports = { Event };
