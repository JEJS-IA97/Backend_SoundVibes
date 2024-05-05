'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Post.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 1024] 
        }
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100] 
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link_soundcloud: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link_youtube: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link_spotify: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
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
    timestamps: true,
    modelName: 'Post',
    tableName: 'post', 
  });
  return Post;
};
