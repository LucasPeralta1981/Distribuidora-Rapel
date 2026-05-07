const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Ruta para subir archivos (Excel, CSV)
router.post('/upload', uploadController.procesarArchivo);

module.exports = router;
