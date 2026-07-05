import { Router } from 'express';
import * as EntrenadorController from '../../controllers/usuarios-controllers/entrenador-controller';
import { verificarToken } from '../../middleware/authentication';

const api = Router();

/**
 * @openapi
 * /api/entrenadores:
 *   get:
 *     tags: [Entrenadores]
 *     summary: Listar entrenadores con paginación
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de entrenadores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 total: { type: integer }
 *                 entrenadores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entrenador'
 *       400:
 *         description: Error al recuperar entrenadores
 */
api.get('/entrenadores', [verificarToken], EntrenadorController.getEntrenadores);

/**
 * @openapi
 * /api/entrenadores/{termino}:
 *   get:
 *     tags: [Entrenadores]
 *     summary: Buscar entrenadores por término
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: termino
 *         required: true
 *         schema: { type: string }
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
 *                     $ref: '#/components/schemas/Entrenador'
 */
api.get('/entrenadores/:termino', [verificarToken], EntrenadorController.getEntrenadoresBusqueda);

/**
 * @openapi
 * /api/entrenador/{id}:
 *   get:
 *     tags: [Entrenadores]
 *     summary: Obtener entrenador por ID de usuario
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Entrenador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 entrenador: { $ref: '#/components/schemas/Entrenador' }
 *       404:
 *         description: Entrenador no encontrado
 */
api.get('/entrenador/:id', [verificarToken], EntrenadorController.getEntrenador);

/**
 * @openapi
 * /api/entrenador:
 *   post:
 *     tags: [Entrenadores]
 *     summary: Crear un nuevo entrenador (usuario + perfil)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntrenadorInput'
 *     responses:
 *       200:
 *         description: Entrenador creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 entrenador: { $ref: '#/components/schemas/Entrenador' }
 *       400:
 *         description: Error de validación
 */
api.post('/entrenador', EntrenadorController.saveEntrenador);

/**
 * @openapi
 * /api/entrenador/{id}:
 *   put:
 *     tags: [Entrenadores]
 *     summary: Actualizar un entrenador
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
 *             type: object
 *             properties:
 *               nombreDeportivo: { type: string }
 *               entrenadorPorteros: { type: boolean }
 *               titulacion: { type: array, items: { type: string } }
 *               telefono: { type: string }
 *     responses:
 *       200:
 *         description: Entrenador actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 entrenador: { $ref: '#/components/schemas/Entrenador' }
 *       404:
 *         description: Entrenador no encontrado
 */
api.put('/entrenador/:id', [verificarToken], EntrenadorController.updateEntrenador);

/**
 * @openapi
 * /api/entrenadores/zona/{idZona}:
 *   get:
 *     tags: [Entrenadores]
 *     summary: Listar entrenadores por zona
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
 *         description: Entrenadores filtrados por zona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 total: { type: integer }
 *                 entrenadores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entrenador'
 */
api.get('/entrenadores/zona/:idZona', [verificarToken], EntrenadorController.getEntrenadoresPorZona);

export default api;