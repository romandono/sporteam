import { Router } from 'express';
import * as LoginController from '../controllers/login';
import { verificarToken } from '../middleware/authentication';

const api = Router();

api.post('/login', LoginController.login);
api.post('/google', LoginController.loginGoogle);
api.get('/login/renew', [verificarToken], LoginController.renewToken);

export default api;
