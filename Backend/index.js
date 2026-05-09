// Backend/src/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Necesitarás instalar esto también: npm install cors

// Importamos las rutas (las crearemos en el siguiente paso)
const productRoutes = require('./src/routes/productRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Permite que el Frontend se comunique con el Backend
app.use(express.json()); // Permite recibir JSON en las peticiones

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(`✅ MongoDB Conectado exitosamente`))
  .catch(err => console.error(`❌ Error conectando a MongoDB: ${err.message}`));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 API de Distribuidora Rapel está funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌍 Servidor corriendo en http://localhost:${PORT}`);
});
