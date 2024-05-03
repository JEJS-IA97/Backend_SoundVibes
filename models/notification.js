'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
    }
  }
  Notification.init({
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 1024] 
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 2] 
      }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 1], 
        isIn: [['A', 'I']] 
      },
      defaultValue: 'A'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Notification',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tableName: 'notifications' 
  });
  return Notification;
};
