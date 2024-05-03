'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Follow extends Model {
    static associate(models) {
    }
  }
  Follow.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Follow',
    tableName: 'followers', 
    timestamps: true 
  });
  return Follow;
};
