'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User)
      Booking.belongsTo(models.Vehicle)
    }
  }
  Booking.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'User is required!' },
        notNull: { msg: 'User is required!' }
      }
    },
    VehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Vehicle is required!' },
        notNull: { msg: 'Vehicle is required!' }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Start Date is required!' },
        notNull: { msg: 'Start Date is required!' }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'End Date is required!' },
        notNull: { msg: 'End Date is required!' }
      }
    },
    originCity: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Origin City Date is required!' },
        notNull: { msg: 'Origin City Date is required!' }
      }
    },
    destinationCity: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Destination City Date is required!' },
        notNull: { msg: 'Destination City Date is required!' }
      }
    },
    distance: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    status: DataTypes.STRING,
    paymentUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};