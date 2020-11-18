const express = require('express');
const EntrenadorController = require('../controllers/entrenador');

const app = express.Router();

const { verificarToken } = require('../middlewares/authentication');

app.post('/entrenador', verificarToken, EntrenadorController.saveEntrenador);
app.get('/entrenadores', verificarToken, EntrenadorController.getEntrenadores);

module.exports = app;