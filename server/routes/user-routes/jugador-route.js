const express = require('express');
const JugadorController = require('../../controllers/usuarios-controllers/jugador-controller');

const app = express.Router();

const { verificarToken, verificarJugador_Rol } = require('../../middlewares/authentication');

app.get('/jugadores', [verificarToken, verificarJugador_Rol], JugadorController.getJugadores);
app.get('/jugador/:id', [verificarToken, verificarJugador_Rol], JugadorController.getJugador);
app.post('/jugador', JugadorController.saveJugador);
app.put('/jugador/:id', [verificarToken, verificarJugador_Rol], JugadorController.updateJugador);

module.exports = app;