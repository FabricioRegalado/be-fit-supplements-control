const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  fecha: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  productos: [
    {
      productoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Producto', 
        required: true 
      },
      cantidad: { 
        type: Number, 
        required: true, 
        min: [1, 'La cantidad debe ser al menos 1'] 
      },
      subtotal: { 
        type: Number, 
        required: true, 
        min: [0, 'El subtotal no puede ser negativo'] 
      },
    },
  ],
  total: { 
    type: Number, 
    required: true, 
    min: [0, 'El total no puede ser negativo'] 
  },
});

// Middleware para calcular el total antes de guardar
ventaSchema.pre('save', function (next) {
  if (this.productos && this.productos.length > 0) {
    this.total = this.productos.reduce((sum, item) => sum + item.subtotal, 0);
  }
  next();
});

module.exports = mongoose.model('Venta', ventaSchema);
