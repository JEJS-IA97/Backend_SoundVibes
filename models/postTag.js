'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PostTag extends Model {
    static associate(models) {
    }
  }
  PostTag.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    hashtag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hashtag',
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
    modelName: 'PostTag',
    tableName: 'post_tags', 
    timestamps: true 
  });
  return PostTag;
};
