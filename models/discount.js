'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      // Relación con Productos
      this.hasMany(models.Product, { 
        foreignKey: 'discount_id',
        as: 'products'
      });
    }
  }
  
  Discount.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre del descuento no puede estar vacío"
        }
      }
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "El porcentaje debe ser al menos 1"
        },
        max: {
          args: [100],
          msg: "El porcentaje no puede ser mayor a 100"
        }
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Debe ser una fecha válida"
        }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Debe ser una fecha válida"
        },
        isAfter: {
          args: [this.start_date],
          msg: "La fecha de fin debe ser posterior a la fecha de inicio"
        }
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Discount',
    tableName: 'Discounts'
  });
  
  return Discount;
};