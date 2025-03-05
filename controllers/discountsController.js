const { Discount, Product } = require('../models');

exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.findAll({
      include: [{ model: Product, as: 'products' }]
    });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDiscount = async (req, res) => {
  try {
    const { name, percentage, start_date, end_date, status = true } = req.body;
    
    // Validaciones adicionales
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ 
        message: "La fecha de inicio debe ser anterior a la fecha de fin" 
      });
    }

    const discount = await Discount.create({
      name, 
      percentage, 
      start_date, 
      end_date, 
      status
    });

    res.status(201).json(discount);
  } catch (error) {
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      message: "Error interno del servidor", 
      error: error.message 
    });
  }
};



exports.updateDiscount = async (req, res) => {
  try {
    const [updated] = await Discount.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedDiscount = await Discount.findByPk(req.params.id);
      return res.json(updatedDiscount);
    }
    throw new Error('Descuento no encontrado');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const deleted = await Discount.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: 'Descuento borrado exitosamente' });
    }
    throw new Error('Descuento no encontrado');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};