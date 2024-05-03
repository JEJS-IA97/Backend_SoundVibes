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
      unique: true,
      references: {
        model: 'Post',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'LikePost',
    tableName: 'likes', 
    timestamps: true 
  });
  return LikePost;
};
