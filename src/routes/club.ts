import { Router } from 'express';
import * as ClubController from '../controllers/club';
import { verificarToken } from '../middleware/authentication';

const api = Router();

/**
 * @openapi
 * /api/clubs:
 *   get:
 *     tags: [Clubs]
 *     summary: Listar clubs con paginación
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema: { type: integer, default: 0 }
 *         description: Índice inicial
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 5 }
 *         description: Máximo de resultados
 *     responses:
 *       200:
 *         description: Lista paginada de clubs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 total: { type: integer }
 *                 clubs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Club'
 *       400:
 *         description: Error al recuperar clubs
 */
api.get('/clubs', [verificarToken], ClubController.getClubs);

/**
 * @openapi
 * /api/clubs/{termino}:
 *   get:
 *     tags: [Clubs]
 *     summary: Buscar clubs por término
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: termino
 *         required: true
 *         schema: { type: string }
 *         description: Término de búsqueda (nombre del club)
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 resultados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Club'
 */
api.get('/clubs/:termino', [verificarToken], ClubController.getClubsBusqueda);

/**
 * @openapi
 * /api/club/{id}:
 *   get:
 *     tags: [Clubs]
 *     summary: Obtener club por ID
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Club encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 club: { $ref: '#/components/schemas/Club' }
 *       404:
 *         description: Club no encontrado
 */
api.get('/club/:id', [verificarToken], ClubController.getClub);

/**
 * @openapi
 * /api/club:
 *   post:
 *     tags: [Clubs]
 *     summary: Crear un nuevo club
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClubInput'
 *     responses:
 *       200:
 *         description: Club creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 club: { $ref: '#/components/schemas/Club' }
 *       400:
 *         description: Error de validación
 */
api.post('/club', ClubController.saveClub);

/**
 * @openapi
 * /api/club/{id}:
 *   put:
 *     tags: [Clubs]
 *     summary: Actualizar un club
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
 *             $ref: '#/components/schemas/CreateClubInput'
 *     responses:
 *       200:
 *         description: Club actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 club: { $ref: '#/components/schemas/Club' }
 *       404:
 *         description: Club no encontrado
 */
api.put('/club/:id', [verificarToken], ClubController.updateClub);

/**
 * @openapi
 * /api/club/{id}:
 *   delete:
 *     tags: [Clubs]
 *     summary: Eliminar un club
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Club eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 message: { type: string }
 *       404:
 *         description: Club no encontrado
 */
api.delete('/club/:id', [verificarToken], ClubController.deleteClub);

/**
 * @openapi
 * /api/clubs/zona/{idZona}:
 *   get:
 *     tags: [Clubs]
 *     summary: Listar clubs por zona
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: idZona
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: desde
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 5 }
 *     responses:
 *       200:
 *         description: Clubs filtrados por zona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 total: { type: integer }
 *                 clubs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Club'
 */
api.get('/clubs/zona/:idZona', verificarToken, ClubController.getClubsPorZona);

export default api;