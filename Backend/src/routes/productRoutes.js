const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllProducts, uploadProducts, scrapeImpotools } = require('../controllers/productController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllProducts);
router.post('/upload', upload.single('file'), uploadProducts);
router.post('/scrape/impotools', scrapeImpotools);

module.exports = router;
