'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PostFav extends Model {
    static associate(models) {
      PostFav.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PostFav.init({
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
    modelName: 'PostFav',
    tableName: 'favorites',
    timestamps: false // No necesitamos createdAt y updatedAt en este modelo
  });
  return PostFav;
};
