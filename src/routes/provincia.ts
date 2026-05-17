import { Router } from 'express';
import * as ProvinciaController from '../controllers/provincia';
import { verificarToken } from '../middleware/authentication';

const api = Router();

api.get('/provincias', verificarToken, ProvinciaController.getProvincias);

export default api;
