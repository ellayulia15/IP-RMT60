'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order)
      User.hasMany(models.Booking)
    }
  }
  User.init({
    nik: DataTypes.STRING,
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Full Name is required!' },
        notNull: { msg: 'Full Name is required!' }
      }
    },
    gender: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email has already been used!' },
      validate: {
        notEmpty: { msg: 'Email is required!' },
        notNull: { msg: 'Email is required!' },
        isEmail: { msg: 'Invalid email format!' }
      }
    },
    password: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    googleToken: DataTypes.STRING,
    authType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Auth Type is required!' },
        notNull: { msg: 'Auth Type is required!' }
      }
    },
  }, {
    hooks: {
      beforeCreate(user) {
        user.password = hashPassword(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};