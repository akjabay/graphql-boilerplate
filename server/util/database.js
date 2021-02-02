const Sequelize = require('sequelize');

const sequelize = new Sequelize('instashop_db', 'root', 'asem3232', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false
});

module.exports = sequelize;
