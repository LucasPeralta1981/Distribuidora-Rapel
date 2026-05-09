const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllProducts, uploadProducts, scrapeImpotools } = require('../controllers/productController');

// Configurar Multer para recibir archivos
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllProducts);
router.post('/upload', upload.single('file'), uploadProducts); // Subir Excel
router.post('/scrape/impotools', scrapeImpotools); // Ejecutar scraping

module.exports = router;