'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Package.hasMany(models.Order)
    }
  }
  Package.init({
    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Package Name is required!' },
        notNull: { msg: 'Package Name is required!' }
      }
    },
    imageUrl: DataTypes.STRING,
    startPrice: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Start Price is required!' },
        notNull: { msg: 'Start Price is required!' }
      }
    },
    pdfLink: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'PDF Link is required!' },
        notNull: { msg: 'PDF Link is required!' }
      }
    },
  }, {
    sequelize,
    modelName: 'Package',
  });
  return Package;
};