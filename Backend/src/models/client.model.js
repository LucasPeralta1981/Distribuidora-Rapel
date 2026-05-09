const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  cuit: { type: String, required: true },
  address: String,
  role: { type: String, enum: ['cliente', 'vendedor', 'admin'], default: 'cliente' },
  isActive: { type: Boolean, default: true },
  preferences: {
    notificationEmail: { type: Boolean, default: true },
    notificationWhatsApp: { type: Boolean, default: false }
  },
  balance: { type: Number, default: 0 } // Cuenta corriente
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);