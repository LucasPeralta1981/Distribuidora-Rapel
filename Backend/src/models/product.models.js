const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ['aceites', 'herramientas', 'cubiertas', 'repuestos_livianos', 'repuestos_pesados'],
    required: true 
  },
  priceCost: { type: Number, required: true }, // Costo
  priceSale: { type: Number, required: true }, // Venta
  stock: { type: Number, default: 0 },
  taxRate: { type: Number, default: 21 }, // IVA
  isActive: { type: Boolean, default: true },
  providerUrl: String,
  logisticsInfo: {
    weight: Number,
    height: Number,
    width: Number,
    depth: Number
  },
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);