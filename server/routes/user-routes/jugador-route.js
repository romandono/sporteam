const express = require('express');
const jugadorController = require('../../controllers/usuarios-controllers/jugador-controller');
const JugadorController = require('../../controllers/usuarios-controllers/jugador-controller');

const app = express.Router();

const { verificarToken, verificarJugador_Rol } = require('../../middlewares/authentication');

app.get('/jugadores', [verificarToken], JugadorController.getJugadores);
app.get('/jugadores/:termino', [verificarToken], JugadorController.getJugadoresBusqueda);
app.get('/jugador/:id', [verificarToken], JugadorController.getJugador);
app.post('/jugador', JugadorController.saveJugador);
app.put('/jugador/:id', [verificarToken], JugadorController.updateJugador);
app.get('/jugadores/zona/:idZona', [verificarToken], jugadorController.getJugadoresPorZona);

module.exports = app;