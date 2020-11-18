const express = require('express');
const JugadorController = require('../controllers/jugador');

const app = express.Router();

const { verificarToken } = require('../middlewares/authentication');

app.post('/jugador', JugadorController.saveJugador);
app.get('/jugadores', verificarToken, JugadorController.getJugadores);

module.exports = app;