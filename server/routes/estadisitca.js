const express = require('express');
const EstadisticaController = require('../controllers/estadistica');
const { verificarToken, verificarAdmin_Rol, verificaTokenImage } = require('../middlewares/authentication');

const api = express.Router();

api.get('/estadistica/:id', verificarToken, EstadisticaController.getEstadistica);

module.exports = api;