import { Router } from 'express';
import * as LoginController from '../controllers/login';
import { verificarToken } from '../middleware/authentication';
import { loginValidation } from '../validators';
import { validate } from '../middleware/validate';

const api = Router();

/**
 * @openapi
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Inicio de sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Token JWT generado
 *       400:
 *         description: Credenciales incorrectas
 */
api.post('/login', loginValidation, validate, LoginController.login);

/**
 * @openapi
 * /api/google:
 *   post:
 *     tags: [Auth]
 *     summary: Inicio de sesión con Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string, description: Token de Google }
 *     responses:
 *       200:
 *         description: Token JWT generado
 *       403:
 *         description: Token de Google inválido
 */
api.post('/google', LoginController.loginGoogle);

/**
 * @openapi
 * /api/login/renew:
 *   get:
 *     tags: [Auth]
 *     summary: Renovar token JWT
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: Token renovado
 *       401:
 *         description: No autorizado
 */
api.get('/login/renew', [verificarToken], LoginController.renewToken);

export default api;
