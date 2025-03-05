const validateDiscount = (req, res, next) => {
    const { percentage, start_date, end_date } = req.body;
  
    // Validación de porcentaje
    if (!percentage || percentage < 1 || percentage > 100) {
      return res.status(400).json({ 
        message: "El porcentaje debe estar entre 1 y 100" 
      });
    }
  
    // Validación de fechas
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        message: "Fechas inválidas" 
      });
    }
  
    if (startDate >= endDate) {
      return res.status(400).json({ 
        message: "La fecha de inicio debe ser anterior a la fecha de fin" 
      });
    }
  
    next();
  };
  
  module.exports = { validateDiscount };