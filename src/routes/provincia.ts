import { Router } from 'express';
import * as ProvinciaController from '../controllers/provincia';
import { verificarToken } from '../middleware/authentication';

const api = Router();

/**
 * @openapi
 * /api/provincias:
 *   get:
 *     tags: [Provincias]
 *     summary: Listar todas las provincias
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: Lista de provincias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 provincias:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Provincia'
 *       400:
 *         description: Error al recuperar provincias
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
api.get('/provincias', verificarToken, ProvinciaController.getProvincias);

export default api;