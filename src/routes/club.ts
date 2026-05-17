import { Router } from 'express';
import * as ClubController from '../controllers/club';
import { verificarToken } from '../middleware/authentication';

const api = Router();

api.get('/clubs', [verificarToken], ClubController.getClubs);
api.get('/clubs/:termino', [verificarToken], ClubController.getClubsBusqueda);
api.get('/club/:id', [verificarToken], ClubController.getClub);
api.delete('/club/:id', [verificarToken], ClubController.deleteClub);
api.post('/club', ClubController.saveClub);
api.put('/club/:id', [verificarToken], ClubController.updateClub);
api.get('/clubs/zona/:idZona', verificarToken, ClubController.getClubsPorZona);

export default api;
