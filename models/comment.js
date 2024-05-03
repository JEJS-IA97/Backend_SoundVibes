'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
    }
  }

  Comment.init({
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Comment', 
    tableName: 'comments' 
  });

  return Comment;
};
