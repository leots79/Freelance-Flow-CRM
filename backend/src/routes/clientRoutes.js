const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Rutas de clientes
router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.post('/', clientController.create);
router.put('/:id', clientController.update);
router.delete('/:id', clientController.delete);

module.exports = router;
