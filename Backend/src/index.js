require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(`✅ MongoDB Conectado exitosamente`))
  .catch(err => console.error(`❌ Error conectando a MongoDB: ${err.message}`));

app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);

app.get('/', (req, res) => {
  res.send('🚀 API de Distribuidora Rapel está funcionando!');
});

app.listen(PORT, () => {
  console.log(`🌍 Servidor corriendo en http://localhost:${PORT}`);
});
