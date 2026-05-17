import { Router, Request, Response } from 'express';
import * as UserController from '../../controllers/usuarios-controllers/users-controller';
import { verificarToken } from '../../middleware/authentication';

const api = Router();

api.get('/usuarios', UserController.getUsuarios);
api.get('/usuario/:id', UserController.getUsuario);
api.post('/usuario', UserController.saveUser);
api.put('/usuario/:id', UserController.updateUser);
api.delete('/usuario/:id', UserController.deleteUser);
api.get('/uploads/:tipo/:foto', UserController.getUserImage);

api.get('/prueba', (req: Request, res: Response) => {
  res.status(200).send({
    ok: true,
    message: 'Hola mundo'
  });
});

export default api;
