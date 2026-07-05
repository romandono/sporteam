import { Router, Request, Response } from 'express';
import * as UserController from '../../controllers/usuarios-controllers/users-controller';
import { verificarToken } from '../../middleware/authentication';
import { createUserValidation } from '../../validators';
import { validate } from '../../middleware/validate';

const api = Router();

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuarios con paginación
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 9 }
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 total: { type: integer }
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Error al recuperar usuarios
 */
api.get('/usuarios', UserController.getUsuarios);

/**
 * @openapi
 * /api/usuario/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener usuario por ID
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 usuario: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Usuario no encontrado
 */
api.get('/usuario/:id', UserController.getUsuario);

/**
 * @openapi
 * /api/usuario:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       200:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 usuario: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Error de validación
 */
api.post('/usuario', createUserValidation, validate, UserController.saveUser);

/**
 * @openapi
 * /api/usuario/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar un usuario
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 usuario: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Usuario no encontrado
 */
api.put('/usuario/:id', UserController.updateUser);

/**
 * @openapi
 * /api/usuario/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 message: { type: string, example: "Usuario eliminado" }
 *       400:
 *         description: Usuario no encontrado
 */
api.delete('/usuario/:id', UserController.deleteUser);

api.get('/uploads/:tipo/:foto', UserController.getUserImage);

api.get('/prueba', (req: Request, res: Response) => {
  res.status(200).send({
    ok: true,
    message: 'Hola mundo'
  });
});

export default api;