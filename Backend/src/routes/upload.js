const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// IMPORTANTE: Importa la ruta de upload que creamos
const uploadRoutes = require('./routes/upload'); 

// Ruta para subir archivos (Excel, CSV)
router.post('/upload', uploadController.procesarArchivo);

module.exports = router;
