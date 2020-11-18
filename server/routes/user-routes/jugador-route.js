const express = require('express');
const JugadorController = require('../../controllers/usuarios-controllers/jugador-controller');

const app = express.Router();

const { verificarToken } = require('../../middlewares/authentication');

app.get('/jugadores', JugadorController.getJugadores);
app.get('/jugador/:id', JugadorController.getJugador);

app.post('/jugador', JugadorController.saveJugador);


module.exports = app;