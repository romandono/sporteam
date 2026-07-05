import { Router } from 'express';
import * as EstadisticaController from '../controllers/estadistica';
import { verificarToken } from '../middleware/authentication';

const api = Router();

/**
 * @openapi
 * /api/estadistica/{id}:
 *   get:
 *     tags: [Estadisticas]
 *     summary: Obtener estadísticas de un jugador por ID de perfil
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del perfil (profileId) del jugador
 *     responses:
 *       200:
 *         description: Estadísticas del jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 estadistica:
 *                   $ref: '#/components/schemas/Estadistica'
 *       400:
 *         description: Error al recuperar estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
api.get('/estadistica/:id', verificarToken, EstadisticaController.getEstadistica);

export default api;