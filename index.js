const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/upload'); 

// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Cargar variables de entorno (clave para seguridad)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico para recibir JSON y archivos
app.use(cors()); // Permite que el Frontend hable con el Backend
app.use(express.json()); // Para leer datos en formato JSON
app.use(express.urlencoded({ extended: true }));
app.use('/api/upload', uploadRoutes); // Ahora la ruta es http://localhost:5000/api/upload

// 1. Conectar a MongoDB
// Asegúrate de tener tu URL de conexión en el archivo .env

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Esto es MUY IMPORTANTE, debe estar al inicio del archivo

const connectDB = async () => {
  try {
    // Aquí solo llamamos a la variable que definimos en .env
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// 2. Definir Rutas (Aún vacías, se llenarán en el siguiente paso)
// Aquí importaremos tus controladores más adelante
// app.use('/api/productos', require('./routes/productos'));

// 3. Ruta de prueba para verificar que el servidor arrancó
app.get('/', (req, res) => {
  res.send('🚀 Servidor de Distribuidora Lucas iniciado. API Listo.');
});

// Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
  });
})