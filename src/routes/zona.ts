import { Router } from 'express';
import * as ZonaController from '../controllers/zona';

const api = Router();

/**
 * @openapi
 * /api/zonas:
 *   get:
 *     tags: [Zonas]
 *     summary: Listar todas las zonas
 *     responses:
 *       200:
 *         description: Lista de zonas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 zonas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Zona'
 *       400:
 *         description: Error al recuperar zonas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
api.get('/zonas', ZonaController.getZonas);

export default api;