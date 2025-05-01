'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User)
      Order.belongsTo(models.Package)
    }
  }
  Order.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'User is required!' },
        notNull: { msg: 'User is required!' }
      }
    },
    PackageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Package is required!' },
        notNull: { msg: 'Package is required!' }
      }
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Booking Date is required!' },
        notNull: { msg: 'Booking Date is required!' }
      }
    },
    status: DataTypes.STRING,
    paymentUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};