const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Topping = sequelize.define('Topping', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
});

module.exports = Topping;
