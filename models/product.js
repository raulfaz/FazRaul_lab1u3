'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Relación con Descuentos
      this.belongsTo(models.Discount, { 
        foreignKey: 'discount_id',
        as: 'discount'
      });
    }

    // Método para calcular precio con descuento
    getPriceWithDiscount() {
      if (this.discount && this.discount.status) {
        const discountPercentage = this.discount.percentage;
        return this.price * (1 - discountPercentage / 100);
      }
      return this.price;
    }
  }
  
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    discount_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    hooks: {
      // Validación de SKU único
      beforeValidate: async (product) => {
        if (product.sku) {
          const existingProduct = await Product.findOne({
            where: { sku: product.sku }
          });
          if (existingProduct && existingProduct.id !== product.id) {
            throw new Error('SKU must be unique');
          }
        }
      }
    }
  });
  
  return Product;
};