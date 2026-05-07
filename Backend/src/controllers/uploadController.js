const multer = require('multer');
const XLSX = require('xlsx');
const Producto = require('../models/Producto');
const path = require('path');

// Configurar Multer para guardar temporalmente el archivo en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de crear esta carpeta o que el código la cree
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Controlador principal
exports.procesarArchivo = [
  upload.single('archivo'), // Espera un archivo con el nombre 'archivo'
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
      }

      const filePath = req.file.path;
      const extension = path.extname(req.file.originalname).toLowerCase();

      let datos = [];
      
      // Lógica para leer Excel o CSV
      if (extension === '.xlsx' || extension === '.xls') {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        datos = XLSX.utils.sheet_to_json(sheet); // Convierte a JSON
      } else if (extension === '.csv') {
        // Aquí podrías implementar la librería 'papaparse' o lógica propia
        // Por simplicidad, asumimos que el usuario convierte CSV a JSON primero o usamos otra librería
        return res.status(500).json({ error: 'Lógica para CSV requiere librería adicional. Se recomienda Excel.' });
      } else {
        return res.status(400).json({ error: 'Formato no soportado. Use .xlsx o .csv' });
      }

      // 1. Validar y Limpiar Datos
      const productosParaGuardar = [];
      
      for (const fila of datos) {
        // Ajusta estas claves según cómo se llamen las columnas en tu Excel
        // Ejemplo: Asumimos que tu Excel tiene columnas: "Nombre", "SKU", "PrecioCosto", "Categoria"
        
        if (!fila.nombre || !fila.sku || !fila.precioCosto) {
          console.warn('Fila inválida saltada:', fila);
          continue;
        }

        // Calcular Precio de Venta (Ej: Costo + 30%)
        const precioVenta = Math.round(fila.precioCosto * 1.30 * 100) / 100;

        productosParaGuardar.push({
          nombre: fila.nombre,
          sku: fila.sku,
          categoria: fila.categoria || 'Repuestos', // Categoría por defecto si falta
          precioCosto: parseFloat(fila.precioCosto),
          precioVenta: precioVenta,
          stock: parseInt(fila.stock) || 0,
          metadata: { proveedor: 'Importado' }
        });
      }

      // 2. Guardar en MongoDB
      if (productosParaGuardar.length === 0) {
        return res.status(400).json({ message: 'No se encontraron productos válidos para guardar' });
      }

      // Insertar masivamente
      const resultado = await Producto.insertMany(productosParaGuardar);
      
      // Eliminar el archivo temporal (opcional pero recomendado)
      const fs = require('fs');
      fs.unlinkSync(filePath);

      res.status(200).json({ 
        message: 'Éxito', 
        cantidad: resultado.length,
        productos: resultado.map(p => p.nombre)
      });

    } catch (error) {
      console.error('Error procesando archivo:', error);
      res.status(500).json({ error: 'Error interno del servidor. Revisa el archivo.' });
    }
  }
];