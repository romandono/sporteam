const express = require('express');
const ZonaController = require('../controllers/zona');

const app = express.Router();

const { verificarToken } = require('../middlewares/authentication');

app.get('/zonas', ZonaController.getZonas);

module.exports = app;