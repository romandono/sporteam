import { Router } from 'express';
import * as ZonaController from '../controllers/zona';
import { verificarToken } from '../middleware/authentication';

const api = Router();

api.get('/zonas', ZonaController.getZonas);

export default api;
