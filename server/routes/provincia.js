const express = require('express');
const ProvinciaController = require('../controllers/provincia');

const app = express.Router();

const { verificarToken } = require('../middlewares/authentication');

app.get('/provincias', verificarToken, ProvinciaController.getProvincias);

module.exports = app;