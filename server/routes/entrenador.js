const express = require('express');
const EntrenadorController = require('../controllers/usuarios-controllers/entrenador-controller');

const app = express.Router();

const { verificarToken } = require('../middlewares/authentication');

app.post('/entrenador', EntrenadorController.saveEntrenador);
app.get('/entrenadores', verificarToken, EntrenadorController.getEntrenadores);

module.exports = app;