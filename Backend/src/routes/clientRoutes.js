const express = require('express');
const router = express.Router();
// Por ahora, una ruta de prueba
router.get('/', (req, res) => {
  res.json({ message: 'Ruta de clientes funcionando' });
});

module.exports = router;
