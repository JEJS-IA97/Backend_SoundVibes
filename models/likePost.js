'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LikePost extends Model {
    static associate(models) {
    }
  }
  LikePost.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }, 
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
  }, {
    sequelize,
    modelName: 'LikePost',
    tableName: 'likes', 
    timestamps: true 
  });
  return LikePost;
};
