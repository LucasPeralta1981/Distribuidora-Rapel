const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true, // Cada producto debe tener un código único
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Aceites', 'Herramientas', 'Cubiertas', 'Repuestos'] // Tus categorías
  },
  proveedor: {
    type: String,
    default: 'General'
  },
  precioCosto: {
    type: Number,
    required: true,
    min: 0
  },
  precioVenta: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  // Campos dinámicos para datos específicos (medidas, viscosidad, etc.)
  metadata: {
    type: Object,
    default: {}
  },
  fechaCarga: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Producto', ProductoSchema);