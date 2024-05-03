'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserTag extends Model {
    static associate(models) {
    }
  }
  UserTag.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    user_id: {
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
    modelName: 'UserTag',
    tableName: 'user_tags', 
    timestamps: true 
  });
  return UserTag;
};
