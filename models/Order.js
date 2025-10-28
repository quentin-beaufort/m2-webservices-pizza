const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  toppings: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('toppings');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('toppings', JSON.stringify(value));
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pizzaPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  }
});

module.exports = Order;
