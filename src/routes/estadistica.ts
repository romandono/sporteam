import { Router } from 'express';
import * as EstadisticaController from '../controllers/estadistica';
import { verificarToken } from '../middleware/authentication';

const api = Router();

api.get('/estadistica/:id', verificarToken, EstadisticaController.getEstadistica);

export default api;
