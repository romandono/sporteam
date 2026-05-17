import { Router } from 'express';
import * as EntrenadorController from '../../controllers/usuarios-controllers/entrenador-controller';
import { verificarToken } from '../../middleware/authentication';

const api = Router();

api.get('/entrenadores', [verificarToken], EntrenadorController.getEntrenadores);
api.get('/entrenadores/:termino', [verificarToken], EntrenadorController.getEntrenadoresBusqueda);
api.get('/entrenador/:id', [verificarToken], EntrenadorController.getEntrenador);
api.post('/entrenador', EntrenadorController.saveEntrenador);
api.put('/entrenador/:id', [verificarToken], EntrenadorController.updateEntrenador);
api.get('/entrenadores/zona/:idZona', [verificarToken], EntrenadorController.getEntrenadoresPorZona);

export default api;
