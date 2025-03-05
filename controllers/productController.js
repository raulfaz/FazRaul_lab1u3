const { Product, Discount } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ 
        model: Discount, 
        as: 'discount',
        where: { 
          status: true 
        },
        required: false
      }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ 
        model: Discount, 
        as: 'discount' 
      }]
    });
    
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      return res.json(updatedProduct);
    }
    
    throw new Error('Producto no encontrado');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted) {
      return res.status(204).send();
    }
    
    throw new Error('Producto no encontrado');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.applyDiscount = async (req, res) => {
  try {
    const { productId, discountId } = req.body;
    
    const product = await Product.findByPk(productId);
    const discount = await Discount.findByPk(discountId);
    
    if (!product || !discount) {
      return res.status(404).json({ message: "Producto o descuento no encontrado" });
    }
    
    await product.update({ discount_id: discountId });
    
    res.json({ 
      message: "Descuento aplicado correctamente", 
      product 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};