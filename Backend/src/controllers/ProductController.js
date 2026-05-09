const Product = require('../models/Product.model');
const ExcelJS = require('exceljs'); // Necesitarás instalar: npm install exceljs
const puppeteer = require('puppeteer');

// 1. Carga Masiva desde Excel/CSV
exports.uploadProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });

    const workbook = new ExcelJS.ReaderBuffer();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets;

    const products = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezados
      products.push({
        sku: row.getCell(1).value,
        name: row.getCell(2).value,
        category: row.getCell(3).value,
        priceCost: row.getCell(4).value,
        priceSale: row.getCell(5).value,
        stock: row.getCell(6).value,
        // Mapear resto de columnas...
      });
    });

    await Product.insertMany(products);
    res.status(201).json({ message: `${products.length} productos cargados con éxito.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Scraping Básico (Ejemplo para impotools)
exports.scrapeImpotools = async (req, res) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://impotools.com.ar/ecommerce', { waitUntil: 'networkidle2' });
    
    const products = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.product-item').forEach(el => {
        items.push({
          name: el.querySelector('.product-name')?.innerText,
          sku: el.querySelector('.sku')?.innerText,
          price: parseFloat(el.querySelector('.price')?.innerText.replace('$','').replace('.','')),
          url: el.querySelector('a')?.href
        });
      });
      return items;
    });

    // Guardar en BD
    await Product.insertMany(products.map(p => ({ ...p, providerUrl: p.url })));
    
    res.json({ success: true, count: products.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await browser.close();
  }
};
