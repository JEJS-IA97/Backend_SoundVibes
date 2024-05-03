'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Hashtag extends Model {
    static associate(models) {
    }
  }
  
  Hashtag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['A', 'I']] 
      },
      defaultValue: 'A' 
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true 
    }
  }, {
    sequelize,
    modelName: 'Hashtag'
  });

  return Hashtag;
};
