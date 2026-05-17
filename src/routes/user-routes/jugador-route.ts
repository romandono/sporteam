import { Router } from 'express';
import * as JugadorController from '../../controllers/usuarios-controllers/jugador-controller';
import { verificarToken } from '../../middleware/authentication';

const api = Router();

api.get('/jugadores', [verificarToken], JugadorController.getJugadores);
api.get('/jugadores/:termino', [verificarToken], JugadorController.getJugadoresBusqueda);
api.get('/jugador/:id', [verificarToken], JugadorController.getJugador);
api.post('/jugador', JugadorController.saveJugador);
api.put('/jugador/:id', [verificarToken], JugadorController.updateJugador);
api.get('/jugadores/zona/:idZona', [verificarToken], JugadorController.getJugadoresPorZona);

export default api;
