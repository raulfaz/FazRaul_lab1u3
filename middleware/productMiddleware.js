const { Product } = require('../models');

const validateProduct = async (req, res, next) => {
  const { name, price, stock, sku } = req.body;

  // Validaciones
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: "El nombre del producto es obligatorio" });
  }

  if (!price || price < 0) {
    return res.status(400).json({ message: "El precio debe ser un número positivo" });
  }

  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ message: "El stock no puede ser negativo" });
  }

  if (!sku || sku.trim() === '') {
    return res.status(400).json({ message: "El SKU es obligatorio" });
  }

  // Verificar SKU único
  try {
    const existingProduct = await Product.findOne({ where: { sku } });
    if (existingProduct && existingProduct.id !== req.params.id) {
      return res.status(400).json({ message: "El SKU ya existe" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error en la validación", error: error.message });
  }

  next();
};

module.exports = { validateProduct };