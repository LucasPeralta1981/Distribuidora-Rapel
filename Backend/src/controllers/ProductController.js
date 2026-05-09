const Product = require('../models/Product.model');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');

// 1. Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Carga Masiva desde Excel
exports.uploadProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió archivo.' });

    const workbook = new ExcelJS.BufferWorkbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets;

    const products = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezados

      // Asumiendo que el Excel tiene columnas en este orden:
      // 1: SKU, 2: Nombre, 3: Categoría, 4: Costo, 5: Venta, 6: Stock
      products.push({
        sku: row.getCell(1).value,
        name: row.getCell(2).value,
        category: row.getCell(3).value,
        priceCost: row.getCell(4).value,
        priceSale: row.getCell(5).value,
        stock: row.getCell(6).value,
        isActive: true
      });
    });

    // Insertar en BD (ignorar duplicados si existen)
    const result = await Product.insertMany(products, { ordered: false });
    res.status(201).json({ 
      message: `Éxito. ${result.length} productos cargados.`,
      inserted: result.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Scraping desde impotools
exports.scrapeImpotools = async (req, res) => {
  console.log('Iniciando scraping...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://impotools.com.ar/ecommerce', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // NOTA: Los selectores (.product-item, etc.) DEBEN coincidir con la web real.
    // Inspecciona la web para obtener los selectores correctos.
    const products = await page.evaluate(() => {
      const items = [];
      // Ejemplo genérico, ajusta los selectores según la web real
      document.querySelectorAll('.product-card, .item, .producto').forEach(el => {
        const nameEl = el.querySelector('h3, .name, .title');
        const priceEl = el.querySelector('.price, .cost');
        const skuEl = el.querySelector('.sku');
        const linkEl = el.querySelector('a');

        if (nameEl && priceEl) {
          items.push({
            name: nameEl.innerText.trim(),
            sku: skuEl ? skuEl.innerText.trim() : `SKU-${Date.now()}-${Math.random()}`,
            priceSale: parseFloat(priceEl.innerText.replace('$', '').replace('.', '').replace(',', '.').trim()),
            providerUrl: linkEl ? linkEl.href : ''
          });
        }
      });
      return items;
    });

    console.log(`Encontrados ${products.length} productos.`);
    
    // Guardar o actualizar productos
    for (const p of products) {
      await Product.findOneAndUpdate(
        { providerUrl: p.providerUrl || p.sku },
        { ...p, category: 'herramientas', priceCost: p.priceSale * 0.7, stock: 10 }, // Lógica simple de costo
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en scraping: ' + error.message });
  } finally {
    await browser.close();
  }
};
