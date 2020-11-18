const express = require('express');
const EntrenadorController = require('../../controllers/usuarios-controllers/entrenador-controller');

const app = express.Router();

const { verificarToken } = require('../../middlewares/authentication');

app.get('/entrenadores', EntrenadorController.getEntrenadores);
app.get('/entrenador/:id', EntrenadorController.getEntrenador);

app.post('/entrenador', EntrenadorController.saveEntrenador);

module.exports = app;